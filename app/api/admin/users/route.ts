import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { getRepositoryFactory } from '@/lib/repositories';
import { validatePasswordStrength } from '@/lib/security/auth';
import { rateLimiters, getRateLimitIdentifier } from '@/lib/rate-limit';
import { validateInput, ValidationRule } from '@/lib/validation';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );

  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userRepository = getRepositoryFactory(supabase).getUserRepository();
  const userProfile = await userRepository.findById(authUser.id);
  if (!userProfile || !['SuperAdmin', 'Admin', 'Moderator', 'superadmin', 'admin', 'moderator'].includes(userProfile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const url = new URL(request.url);
  const q = url.searchParams.get('q') || '';

  // Search users using repository
  const users = await userRepository.searchUsers(q, 50);

  // Remove sensitive fields
  const sanitizedUsers = users.map(user => ({
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
    is_active: user.is_active,
    two_factor_enabled: user.two_factor_enabled,
    last_login: user.last_login,
    created_at: user.created_at,
    updated_at: user.updated_at
  }));

  return NextResponse.json({ users: sanitizedUsers });
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientId = getRateLimitIdentifier(request);
  const rateLimit = await rateLimiters.api(clientId);
  if (!rateLimit.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );

  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userRepository = getRepositoryFactory(supabase).getUserRepository();
  const userProfile = await userRepository.findById(authUser.id);
  if (!userProfile || !['SuperAdmin', 'Admin', 'superadmin', 'admin'].includes(userProfile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // TODO: Add CSRF verification
  // if (!verifyCSRF(request)) return NextResponse.json({ error: 'CSRF' }, { status: 403 });

  const body = await request.json();
  const { email, firstName, lastName, role, password } = body || {};

  // Validate input using validation utility
  const validationRules: ValidationRule[] = [
    { field: 'email', type: 'email', required: true },
    { field: 'firstName', type: 'string', required: true },
    { field: 'lastName', type: 'string', required: true },
    { field: 'password', type: 'string', required: true },
    { field: 'role', type: 'string', required: false },
  ];

  const validationResult = validateInput(body, validationRules);
  if (!validationResult.valid) {
    return NextResponse.json(
      { error: `Validation failed: ${validationResult.errors.map(e => e.message).join(', ')}` },
      { status: 400 }
    );
  }

  // Prevent creating SuperAdmin accounts through this interface
  if (role === 'superadmin') {
    return NextResponse.json({ error: 'SuperAdmin accounts can only be created through authorized scripts' }, { status: 403 });
  }

  // Validate role
  if (role && !['admin', 'moderator', 'user'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  const { isValid, errors } = validatePasswordStrength(password);
  if (!isValid) {
    return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
  }

  // Check if email already exists
  const existingUser = await userRepository.findByEmail(email.toLowerCase());
  if (existingUser) {
    return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
  }

  try {
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email.toLowerCase(),
      password: password,
      email_confirm: true, // Auto-confirm for admin-created accounts
      user_metadata: {
        first_name: firstName,
        last_name: lastName
      }
    });

    if (authError || !authData.user) {
      return NextResponse.json({ error: 'Failed to create user account' }, { status: 500 });
    }

    // Create user profile in our database
    const created = await userRepository.create({
      id: authData.user.id,
      email: email.toLowerCase(),
      password_hash: '', // Handled by Supabase Auth
      first_name: firstName,
      last_name: lastName,
      phone: '',
      role: (role as 'superadmin' | 'admin' | 'moderator' | 'user') || 'moderator',
      is_active: true,
      is_verified: true,
      two_factor_enabled: false
    });

    // TODO: Add audit logging
    // await auditLogRepository.create({
    //   user_id: authUser.id,
    //   action: 'USER_CREATE',
    //   entity_type: 'user',
    //   entity_id: created.id,
    //   details: { target: created.email },
    //   ip_address: request.headers.get("x-forwarded-for") || "unknown",
    //   user_agent: request.headers.get("user-agent") || "unknown",
    //   success: true
    // });

    return NextResponse.json({
      user: {
        id: created.id,
        email: created.email,
        first_name: created.first_name,
        last_name: created.last_name,
        role: created.role
      }
    });
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );

  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userRepository = getRepositoryFactory(supabase).getUserRepository();
  const userProfile = await userRepository.findById(authUser.id);
  if (!userProfile || !['SuperAdmin', 'Admin', 'superadmin', 'admin'].includes(userProfile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // TODO: Add CSRF verification
  // if (!verifyCSRF(request)) return NextResponse.json({ error: 'CSRF' }, { status: 403 });

  const { id, role, isActive, resetPassword } = await request.json();

  const target = await userRepository.findById(id);
  if (!target) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // TODO: Add reauth check
  // const reauth = request.cookies.get('reauth')?.value === '1';
  // if ((role || resetPassword) && !reauth) {
  //   return NextResponse.json({ error: 'Re-authentication required' }, { status: 401 });
  // }

  const updates: Partial<typeof target> = {};

  if (typeof isActive === 'boolean') {
    updates.is_active = isActive;
  }

  if (role) {
    updates.role = role;
  }

  if (resetPassword) {
    const { isValid, errors } = validatePasswordStrength(resetPassword);
    if (!isValid) {
      return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
    }

    // Update password in Supabase Auth
    const { error: passwordError } = await supabase.auth.admin.updateUserById(id, {
      password: resetPassword
    });

    if (passwordError) {
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }
  }

  if (Object.keys(updates).length > 0) {
    await userRepository.updateProfile(id, updates);
  }

  // TODO: Add audit logging
  // await auditLogRepository.create({
  //   user_id: authUser.id,
  //   action: 'USER_UPDATE',
  //   entity_type: 'user',
  //   entity_id: id,
  //   details: { changes: { role, isActive, resetPassword: !!resetPassword } },
  //   ip_address: request.headers.get("x-forwarded-for") || "unknown",
  //   user_agent: request.headers.get("user-agent") || "unknown",
  //   success: true
  // });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );

  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userRepository = getRepositoryFactory(supabase).getUserRepository();
  const userProfile = await userRepository.findById(authUser.id);
  if (!userProfile || !['SuperAdmin', 'Admin', 'superadmin', 'admin'].includes(userProfile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // TODO: Add CSRF verification
  // if (!verifyCSRF(request)) return NextResponse.json({ error: 'CSRF' }, { status: 403 });

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  // TODO: Add reauth check
  // const reauth = request.cookies.get('reauth')?.value === '1';
  // if (!reauth) return NextResponse.json({ error: 'Re-authentication required' }, { status: 401 });

  try {
    // Delete from Supabase Auth (admin operation)
    const { error: authError } = await supabase.auth.admin.deleteUser(id);
    if (authError) {
      console.error('Failed to delete auth user:', authError);
      // Continue with profile deletion even if auth deletion fails
    }

    // Delete user profile from our database
    // Note: Using BaseRepository delete method
    const baseRepo = userRepository as any; // Cast to access protected method
    await baseRepo.delete(id);

    // TODO: Add audit logging
    // await auditLogRepository.create({
    //   user_id: authUser.id,
    //   action: 'USER_DELETE',
    //   entity_type: 'user',
    //   entity_id: id,
    //   details: {},
    //   ip_address: request.headers.get("x-forwarded-for") || "unknown",
    //   user_agent: request.headers.get("user-agent") || "unknown",
    //   success: true
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('User deletion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

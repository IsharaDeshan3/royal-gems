import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth/service';
import { getRepositoryFactory } from '@/lib/repositories';
import { supabase } from '@/lib/supabase';
import { validatePasswordStrength } from '@/lib/security/auth';

const userRepository = getRepositoryFactory(supabase).getUserRepository();

export async function GET(request: NextRequest) {
  const authUser = await authService.getCurrentUser();
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check superadmin role
  const userProfile = await userRepository.findById(authUser.id);
  if (!userProfile || userProfile.role !== 'superadmin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Get admin and moderator users
  const admins = await userRepository.findByRole('admin');
  const moderators = await userRepository.findByRole('moderator');
  const allAdmins = [...admins, ...moderators];

  // Sort by creation date (newest first)
  allAdmins.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Remove sensitive fields
  const sanitizedAdmins = allAdmins.map(admin => ({
    id: admin.id,
    email: admin.email,
    first_name: admin.first_name,
    last_name: admin.last_name,
    role: admin.role,
    is_active: admin.is_active,
    is_verified: admin.is_verified,
    two_factor_enabled: admin.two_factor_enabled,
    last_login: admin.last_login,
    created_at: admin.created_at,
    updated_at: admin.updated_at
  }));

  return NextResponse.json({ admins: sanitizedAdmins });
}

export async function POST(request: NextRequest) {
  const authUser = await authService.getCurrentUser();
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check superadmin role
  const userProfile = await userRepository.findById(authUser.id);
  if (!userProfile || userProfile.role !== 'superadmin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // TODO: Add CSRF verification
  // if (!verifyCSRF(request)) {
  //   return NextResponse.json({ error: 'CSRF' }, { status: 403 });
  // }

  const body = await request.json();
  const { email, firstName, lastName, role, password } = body;

  if (!email || !firstName || !lastName || !password) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Only allow Admin and Moderator roles
  if (!['admin', 'moderator'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role. Only Admin and Moderator can be created through this interface.' }, { status: 400 });
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
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName
      }
    });

    if (authError || !authData.user) {
      return NextResponse.json({ error: 'Failed to create admin account' }, { status: 500 });
    }

    // Create user profile in our database
    const created = await userRepository.create({
      id: authData.user.id,
      email: email.toLowerCase(),
      password_hash: '',
      first_name: firstName,
      last_name: lastName,
      phone: '',
      role: role as 'admin' | 'moderator',
      is_active: true,
      is_verified: true,
      two_factor_enabled: false
    });

    // TODO: Add audit logging
    // await auditLogRepository.create({
    //   user_id: authUser.id,
    //   action: 'ADMIN_CREATE',
    //   entity_type: 'user',
    //   entity_id: created.id,
    //   details: { target: created.email, role: created.role },
    //   ip_address: request.headers.get("x-forwarded-for") || "unknown",
    //   user_agent: request.headers.get("user-agent") || "unknown",
    //   success: true
    // });

    return NextResponse.json({
      admin: {
        id: created.id,
        email: created.email,
        first_name: created.first_name,
        last_name: created.last_name,
        role: created.role,
        is_active: created.is_active,
        created_at: created.created_at
      }
    });
  } catch (error) {
    console.error('Admin creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
import { NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { getRepositoryFactory } from '@/lib/repositories';

export async function getAuthenticatedUser(request: NextRequest) {
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

  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return { user: null, supabase, error: error?.message || 'Unauthorized' };
  }

  const userRepository = getRepositoryFactory(supabase).getUserRepository();
  const userProfile = await userRepository.findById(user.id);

  return { user: userProfile, supabase, error: null };
}

export async function getAdminClient(request: NextRequest) {
  return createServerClient(
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
}

export function isAdminRole(role: string): boolean {
  return ['SuperAdmin', 'Admin', 'Moderator', 'superadmin', 'admin', 'moderator'].includes(role);
}

export function isHighAdminRole(role: string): boolean {
  return ['SuperAdmin', 'Admin', 'superadmin', 'admin'].includes(role);
}

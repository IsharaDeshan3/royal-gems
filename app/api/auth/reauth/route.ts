import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth/service';

export async function POST(request: NextRequest) {
  const authUser = await authService.getCurrentUser();
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { password } = await request.json();
  if (!password) {
    return NextResponse.json({ error: 'Password required' }, { status: 400 });
  }

  // Verify password by attempting sign in (this is a simplified approach)
  const signInResult = await authService.signIn({
    email: authUser.email!,
    password: password
  });

  if (signInResult.error) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set('reauth', '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 5 * 60, // 5 minutes
    path: '/',
  });
  return res;
}

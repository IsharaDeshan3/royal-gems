import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth/service';
import { getRepositoryFactory } from '@/lib/repositories';
import { supabase } from '@/lib/supabase';
import path from 'path';
import fs from 'fs';
import { generateSecureFilename, validateFileSize, validateFileType } from '@/lib/security/auth';

export const runtime = 'nodejs';

const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const userRepository = getRepositoryFactory(supabase).getUserRepository();

export async function POST(request: NextRequest) {
  const authUser = await authService.getCurrentUser();
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check admin role
  const userProfile = await userRepository.findById(authUser.id);
  if (!userProfile || !['superadmin', 'admin', 'moderator'].includes(userProfile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // TODO: Add CSRF verification
  // if (!verifyCSRF(request)) return NextResponse.json({ error: 'CSRF' }, { status: 403 });

  try {
    const form = await request.formData();
    const file = form.get('file') as unknown as File | null;
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validateFileType(file.type, allowed)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    const max = Number(process.env.MAX_FILE_SIZE || 5 * 1024 * 1024);
    if (!validateFileSize(file.size, max)) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = generateSecureFilename(file.name);
    const fullPath = path.join(uploadDir, filename);
    fs.writeFileSync(fullPath, buffer);

    return NextResponse.json({ success: true, path: path.relative(process.cwd(), fullPath) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Upload failed' }, { status: 400 });
  }
}

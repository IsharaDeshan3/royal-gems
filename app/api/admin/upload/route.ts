import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, isAdminRole } from "@/lib/auth/middleware-helper";
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload request received');

    const { user, supabase, error } = await getAuthenticatedUser(request);
    if (error || !user || !isAdminRole(user.role)) {
      console.log('Authentication failed:', { error, user: user?.id, role: user?.role });
      return NextResponse.json(
        { error: error || "Forbidden - Admin access required" },
        { status: error ? 401 : 403 }
      );
    }

    console.log('User authenticated:', user.id, user.role);

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.log('No file provided in form data');
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    console.log('File received:', { name: file.name, size: file.size, type: file.type });

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('Invalid file type:', file.type);
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.log('File too large:', file.size, 'max:', maxSize);
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Generate unique filename with proper extension
    const fileName = file.name || 'upload';
    const fileExt = fileName.includes('.') ? fileName.split('.').pop() : 'jpg'; // Default to jpg if no extension
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `gems/${uniqueFileName}`;

    console.log('Uploading to Supabase:', { filePath, bucket: 'gems-images' });

    // Use service role client for storage operations (bypasses RLS)
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Convert file to buffer if needed
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Upload to Supabase Storage using service role
    const { data, error: uploadError } = await serviceSupabase.storage
      .from('gems-images')
      .upload(filePath, fileBuffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json(
        { error: `Failed to upload image: ${uploadError.message}` },
        { status: 500 }
      );
    }

    console.log('Upload successful:', data);

    // Get public URL using service client
    const { data: { publicUrl } } = serviceSupabase.storage
      .from('gems-images')
      .getPublicUrl(filePath);

    console.log('Public URL generated:', publicUrl);

    return NextResponse.json({
      url: publicUrl,
      path: filePath
    }, { status: 200 });

  } catch (error: any) {
    console.error("Unexpected error in upload:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}

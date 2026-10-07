import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/jwt';
import { uploadToImgBB } from '@/lib/imgbb/upload';

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Admin login required.' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const base64Input = formData.get('image') as string | null;

    if (!file && !base64Input) {
      return NextResponse.json({ success: false, error: 'No image file provided' }, { status: 400 });
    }

    let result;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      result = await uploadToImgBB(buffer, file.name.replace(/\.[^/.]+$/, ''));
    } else if (base64Input) {
      result = await uploadToImgBB(base64Input);
    }

    if (!result || !result.success) {
      return NextResponse.json({ success: false, error: result?.error || 'Upload failed' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      display_url: result.display_url,
      thumb_url: result.thumb_url,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

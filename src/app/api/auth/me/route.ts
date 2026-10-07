import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/jwt';

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: admin });
}

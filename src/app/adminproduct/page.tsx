import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/jwt';

export default async function AdminRootPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/adminproduct/login');
  } else {
    redirect('/adminproduct/dashboard');
  }
}

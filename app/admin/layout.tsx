export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { AuthProvider } from '@/components/auth/auth-provider';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}


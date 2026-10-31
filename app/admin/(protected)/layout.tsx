'use client';

import dynamic from 'next/dynamic';
import { AdminGuard } from '@/components/auth/admin-guard';

const AdminShell = dynamic(
  () => import('@/components/layout/admin-shell').then((mod) => mod.AdminShell),
  { ssr: false }
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}

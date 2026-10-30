export const dynamic = 'auto';
export const revalidate = 60;

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { EarlyAccessModalContainer } from '@/components/home/early-access-modal';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <EarlyAccessModalContainer />
    </div>
  );
}

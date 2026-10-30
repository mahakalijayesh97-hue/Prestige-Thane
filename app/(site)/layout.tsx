export const dynamic = 'auto';
export const revalidate = 60;

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { EarlyAccessModalContainer } from '@/components/home/early-access-modal';
import { PropertyAdvisorChat } from '@/components/layout/property-advisor-chat';
import { getGlobalThemeSettings } from '@/lib/data';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const theme = await getGlobalThemeSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <EarlyAccessModalContainer />
      <PropertyAdvisorChat
        initialEnabled={theme.advisor_chat_enabled !== false}
        whatsappNumber={theme.advisor_chat_whatsapp || '919022222448'}
      />
    </div>
  );
}

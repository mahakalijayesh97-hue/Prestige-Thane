import { SmtpSettingsManager } from '@/components/admin/smtp-settings-manager';

export const metadata = {
  title: 'SMTP Email Configuration | Admin Console',
  description: 'Configure outgoing SMTP mail server and email notification settings.',
};

export default function AdminSmtpPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <SmtpSettingsManager />
    </div>
  );
}

import { getSettings } from '@/lib/data';
import { ContactForm } from './contact-form';
import { Mail, Phone, MapPin } from 'lucide-react';

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
      <p className="mt-2 text-muted-foreground">We&apos;d love to hear from you. Fill out the form below.</p>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold">Get in touch</h2>
          <div className="mt-4 space-y-4 text-sm">
            {settings?.contact_email && (
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-muted-foreground">{settings.contact_email}</div>
                </div>
              </div>
            )}
            {settings?.contact_phone && (
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Phone</div>
                  <div className="text-muted-foreground">{settings.contact_phone}</div>
                </div>
              </div>
            )}
            {settings?.contact_address && (
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Address</div>
                  <div className="text-muted-foreground">{settings.contact_address}</div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Mail,
  Send,
  Server,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  HelpCircle,
  BellRing,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface SmtpSettingsData {
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  hasPassword?: boolean;
  from_name: string;
  from_email: string;
  admin_email: string;
  notify_on_lead: boolean;
  notify_on_contact: boolean;
}

const PRESETS = [
  {
    name: 'Gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    note: 'Requires a Google 16-character App Password',
  },
  {
    name: 'Outlook / 365',
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    note: 'Office 365 or Outlook.com SMTP',
  },
  {
    name: 'Zoho Mail',
    host: 'smtppro.zoho.com',
    port: 465,
    secure: true,
    note: 'Zoho Workspace or Zoho Mail',
  },
  {
    name: 'SendGrid',
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    note: 'Username is "apikey", Password is your SendGrid API key',
  },
  {
    name: 'Hostinger / cPanel',
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    note: 'Standard web hosting email account',
  },
];

export function SmtpSettingsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [testRecipient, setTestRecipient] = useState('');
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  const [settings, setSettings] = useState<SmtpSettingsData>({
    enabled: false,
    host: '',
    port: 587,
    secure: false,
    user: '',
    pass: '',
    hasPassword: false,
    from_name: 'Prestige Thane Desk',
    from_email: '',
    admin_email: '',
    notify_on_lead: true,
    notify_on_contact: true,
  });

  useEffect(() => {
    loadSmtpSettings();
  }, []);

  async function loadSmtpSettings() {
    try {
      setLoading(true);
      const res = await fetch('/api/settings/smtp', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setSettings({
          enabled: Boolean(data.enabled),
          host: data.host || '',
          port: Number(data.port) || 587,
          secure: Boolean(data.secure),
          user: data.user || '',
          pass: data.pass || '',
          hasPassword: Boolean(data.hasPassword),
          from_name: data.from_name || 'Prestige Thane Desk',
          from_email: data.from_email || '',
          admin_email: data.admin_email || '',
          notify_on_lead: data.notify_on_lead !== false,
          notify_on_contact: data.notify_on_contact !== false,
        });
        if (data.admin_email) {
          setTestRecipient(data.admin_email.split(',')[0].trim());
        }
      }
    } catch (err) {
      console.error('Failed to load SMTP settings:', err);
    } finally {
      setLoading(false);
    }
  }

  function applyPreset(preset: (typeof PRESETS)[number]) {
    setSettings((prev) => ({
      ...prev,
      host: preset.host,
      port: preset.port,
      secure: preset.secure,
    }));
  }

  async function handleSave() {
    try {
      setSaving(true);
      setSavedNotice(false);

      const res = await fetch('/api/settings/smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save SMTP settings');
      }

      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 4000);
      await loadSmtpSettings();
    } catch (err: any) {
      alert(err.message || 'Error saving SMTP configuration');
    } finally {
      setSaving(false);
    }
  }

  async function handleSendTest() {
    try {
      setTesting(true);
      setTestResult(null);

      const res = await fetch('/api/settings/smtp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          test_recipient: testRecipient || settings.admin_email || settings.user,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setTestResult({
          ok: false,
          message: data.error || 'Connection failed. Please check host, port, and credentials.',
        });
      } else {
        setTestResult({
          ok: true,
          message: data.message || 'SMTP verified and test email delivered successfully!',
        });
      }
    } catch (err: any) {
      setTestResult({
        ok: false,
        message: err.message || 'Network error while attempting to connect to SMTP server.',
      });
    } finally {
      setTesting(false);
    }
  }

  if (loading) {
    return (
      <Card className="p-8 border border-border/80 bg-card rounded-2xl flex items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading SMTP configuration...</span>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── HEADER BANNER CARD ─── */}
      <Card className="p-6 border border-border/80 bg-gradient-to-br from-card via-card to-primary/5 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">SMTP Email Configuration</h3>
                <Badge
                  variant={settings.enabled ? 'default' : 'secondary'}
                  className={settings.enabled ? 'bg-emerald-600 hover:bg-emerald-600' : ''}
                >
                  {settings.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configure your outgoing mail server to send automated instant email alerts for new buyer leads and contact queries.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-xl shadow-xs cursor-pointer w-full sm:w-auto"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </Button>
          </div>
        </div>

        {savedNotice && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>SMTP configuration updated and stored securely.</span>
          </div>
        )}
      </Card>

      {/* ─── QUICK PRESETS ─── */}
      <Card className="p-5 border border-border/80 bg-card rounded-2xl shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Popular SMTP Service Presets
            </h4>
          </div>
          <span className="text-[11px] text-muted-foreground hidden sm:inline">
            Click a provider to autofill recommended host &amp; port
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {PRESETS.map((p) => {
            const isMatch = settings.host === p.host && Number(settings.port) === p.port;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => applyPreset(p)}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  isMatch
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border/80 bg-card hover:bg-muted/60 text-foreground'
                }`}
              >
                <div className="text-xs font-bold">{p.name}</div>
                <div className="text-[10px] text-muted-foreground truncate">{p.host}</div>
              </button>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── CREDENTIALS & SERVER SETTINGS (2 COLS) ─── */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border border-border/80 bg-card rounded-2xl shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-bold text-foreground">Server &amp; Authentication</h4>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="smtp-enable-switch" className="text-xs font-semibold cursor-pointer">
                  Activate Email Service
                </Label>
                <Switch
                  id="smtp-enable-switch"
                  checked={settings.enabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label className="text-xs font-semibold">SMTP Host</Label>
                <input
                  type="text"
                  placeholder="smtp.gmail.com"
                  value={settings.host}
                  onChange={(e) => setSettings({ ...settings, host: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Port</Label>
                <input
                  type="number"
                  placeholder="587"
                  value={settings.port}
                  onChange={(e) => {
                    const newPort = Number(e.target.value) || 587;
                    setSettings({
                      ...settings,
                      port: newPort,
                      secure: newPort === 465 ? true : newPort === 587 ? false : settings.secure,
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/60">
              <Switch
                id="smtp-secure-switch"
                checked={settings.secure}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    secure: checked,
                    port: checked && settings.port === 587 ? 465 : !checked && settings.port === 465 ? 587 : settings.port,
                  })
                }
              />
              <div className="flex-1">
                <Label htmlFor="smtp-secure-switch" className="text-xs font-semibold cursor-pointer block">
                  Use SSL / Direct TLS (Port 465)
                </Label>
                <span className="text-[11px] text-muted-foreground block">
                  Keep <strong>OFF</strong> for Port 587 (STARTTLS). Turn <strong>ON</strong> for Port 465 (SMTPS).
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">SMTP Username / Email</Label>
                <input
                  type="text"
                  placeholder="your-email@gmail.com"
                  value={settings.user}
                  onChange={(e) => setSettings({ ...settings, user: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">SMTP Password / App Password</Label>
                  {settings.hasPassword && (
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> Stored
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={settings.hasPassword ? '•••••••• (leave empty to keep unchanged)' : 'Enter password'}
                    value={settings.pass}
                    onChange={(e) => setSettings({ ...settings, pass: e.target.value })}
                    className="w-full pl-3 pr-10 py-2 rounded-xl border border-input bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5" /> Note for Gmail Users:
              </div>
              <p className="text-[11px] text-amber-700 dark:text-amber-300">
                Google requires a <strong>16-digit App Password</strong> rather than your personal account password. Generate one under <em>Google Account &gt; Security &gt; 2-Step Verification &gt; App Passwords</em>.
              </p>
            </div>
          </Card>

          {/* ─── SENDER IDENTITY & DISPATCH ─── */}
          <Card className="p-6 border border-border/80 bg-card rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <Lock className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-bold text-foreground">Sender &amp; Recipient Configuration</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">From Name</Label>
                <input
                  type="text"
                  placeholder="Prestige Thane Desk"
                  value={settings.from_name}
                  onChange={(e) => setSettings({ ...settings, from_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">From Email Address</Label>
                <input
                  type="email"
                  placeholder="no-reply@prestige-thane.com"
                  value={settings.from_email}
                  onChange={(e) => setSettings({ ...settings, from_email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
                <span className="text-[10px] text-muted-foreground">
                  Defaults to SMTP Username if left empty.
                </span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <Label className="text-xs font-semibold">Admin Notification Email(s)</Label>
              <input
                type="text"
                placeholder="sales@prestige-thane.com, director@prestige-thane.com"
                value={settings.admin_email}
                onChange={(e) => setSettings({ ...settings, admin_email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
              <span className="text-[10px] text-muted-foreground">
                All buyer leads and contact enquiries will be delivered to this email (separate multiple addresses with commas).
              </span>
            </div>

            {/* Notification triggers */}
            <div className="pt-2 border-t border-border/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notify-lead-switch" className="text-xs font-semibold cursor-pointer block">
                    Instant Lead Notifications
                  </Label>
                  <span className="text-[11px] text-muted-foreground block">
                    Trigger email alerts whenever a customer submits an inquiry from hero, booking, or inline forms.
                  </span>
                </div>
                <Switch
                  id="notify-lead-switch"
                  checked={settings.notify_on_lead}
                  onCheckedChange={(checked) => setSettings({ ...settings, notify_on_lead: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notify-contact-switch" className="text-xs font-semibold cursor-pointer block">
                    Contact Page Inquiries
                  </Label>
                  <span className="text-[11px] text-muted-foreground block">
                    Trigger email alerts for messages submitted via the Contact Us form.
                  </span>
                </div>
                <Switch
                  id="notify-contact-switch"
                  checked={settings.notify_on_contact}
                  onCheckedChange={(checked) => setSettings({ ...settings, notify_on_contact: checked })}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* ─── LIVE TESTING & VERIFICATION (1 COL) ─── */}
        <div className="space-y-6">
          <Card className="p-6 border border-border/80 bg-card rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <BellRing className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-bold text-foreground">Test SMTP Connection</h4>
            </div>

            <p className="text-xs text-muted-foreground">
              Send a test email to ensure your SMTP credentials, authentication, and firewall ports allow outgoing traffic.
            </p>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Recipient Email for Test</Label>
              <input
                type="email"
                placeholder="your-personal@email.com"
                value={testRecipient}
                onChange={(e) => setTestRecipient(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <Button
              type="button"
              onClick={handleSendTest}
              disabled={testing || !settings.host || !settings.user}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 border-primary/40 hover:bg-primary/5 text-primary font-semibold py-2 rounded-xl cursor-pointer"
            >
              {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span>{testing ? 'Verifying & Sending...' : 'Send Test Email'}</span>
            </Button>

            {testResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs ${
                  testResult.ok
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                    : 'bg-destructive/10 border-destructive/20 text-destructive'
                }`}
              >
                <div className="flex items-start gap-2">
                  {testResult.ok ? (
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-destructive" />
                  )}
                  <div className="break-words leading-relaxed">{testResult.message}</div>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-5 border border-border/80 bg-muted/30 rounded-2xl space-y-3">
            <h5 className="text-xs font-bold text-foreground uppercase tracking-wider">Troubleshooting Tips</h5>
            <ul className="text-[11px] text-muted-foreground space-y-2 list-disc pl-4">
              <li>
                <strong>Error: ETIMEDOUT or ECONNREFUSED</strong>: Check if the port (587 or 465) matches SSL setting.
              </li>
              <li>
                <strong>Error: 535 5.7.8 Username and Password not accepted</strong>: The username or application password is incorrect.
              </li>
              <li>
                <strong>Multiple Admins</strong>: Enter emails separated by commas in "Admin Notification Email(s)".
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

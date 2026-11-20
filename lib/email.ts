import nodemailer from 'nodemailer';
import { connectToDatabase } from '@/lib/mongodb';
import SmtpSetting, { ISmtpSetting } from '@/lib/models/SmtpSetting';

export interface SmtpConfigInput {
  enabled?: boolean;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from_name?: string;
  from_email?: string;
  admin_email?: string;
  notify_on_lead?: boolean;
  notify_on_contact?: boolean;
}

export async function getSmtpSettings(): Promise<ISmtpSetting | null> {
  try {
    await connectToDatabase();
    const config = await SmtpSetting.findOne({}).lean();
    return (config as ISmtpSetting) || null;
  } catch (error) {
    console.error('Failed to load SMTP settings from DB:', error);
    return null;
  }
}

export function createTransporter(config: SmtpConfigInput) {
  const portNum = Number(config.port) || 587;
  // Port 465 is implicit SSL/TLS (secure: true)
  // Port 587 and 25 use STARTTLS (secure: false)
  const isSecure =
    portNum === 465
      ? true
      : portNum === 587 || portNum === 25
      ? false
      : Boolean(config.secure);

  return nodemailer.createTransport({
    host: config.host.trim(),
    port: portNum,
    secure: isSecure,
    auth: {
      user: config.user.trim(),
      pass: config.pass,
    },
    tls: {
      // Allow servers with self-signed or modern TLS
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
  });
}

export async function testSmtpConnection(config: SmtpConfigInput, recipientEmail?: string) {
  if (!config.host || !config.user || !config.pass) {
    throw new Error('Host, username, and password are required to test SMTP connection.');
  }

  const portNum = Number(config.port) || 587;
  const isSecure =
    portNum === 465
      ? true
      : portNum === 587 || portNum === 25
      ? false
      : Boolean(config.secure);
  const transporter = createTransporter(config);
  
  // 1. Verify connection
  await transporter.verify();

  // 2. If a recipient is given, send an actual test email
  const to = recipientEmail?.trim() || config.admin_email?.trim() || config.user?.trim();
  if (to) {
    const fromAddress = config.from_email?.trim() || config.user?.trim();
    const senderName = config.from_name?.trim() || 'Prestige Admin';
    await transporter.sendMail({
      from: `"${senderName}" <${fromAddress}>`,
      to,
      subject: '✅ SMTP Configuration Test Successful',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 20px; border-radius: 8px; text-align: center;">
            <h2 style="margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 0.5px;">SMTP Test Succeeded</h2>
            <p style="margin: 6px 0 0; font-size: 13px; color: #94a3b8;">Prestige Thane System Notification</p>
          </div>
          
          <div style="padding: 24px 8px 16px;">
            <p style="font-size: 15px; color: #1e293b; line-height: 1.6;">
              Great news! Your SMTP credentials were verified successfully. Your website is now ready to dispatch real-time lead and contact alerts directly to your inbox.
            </p>
            
            <div style="margin-top: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
              <h4 style="margin: 0 0 10px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">Active Configuration:</h4>
              <p style="margin: 4px 0; font-size: 13px; color: #334155;"><strong>SMTP Host:</strong> ${config.host}</p>
              <p style="margin: 4px 0; font-size: 13px; color: #334155;"><strong>Port:</strong> ${config.port} (${isSecure ? 'SSL' : 'TLS/STARTTLS'})</p>
              <p style="margin: 4px 0; font-size: 13px; color: #334155;"><strong>Sender:</strong> ${fromAddress}</p>
              <p style="margin: 4px 0; font-size: 13px; color: #334155;"><strong>Timestamp:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
            </div>
          </div>
          
          <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 16px; color: #94a3b8; font-size: 12px;">
            This is an automated test message from your website admin console.
          </div>
        </div>
      `,
    });
  }

  return { success: true, message: `SMTP verified and test email sent to ${to}` };
}

export async function sendLeadNotificationEmail(lead: {
  name?: string;
  phone: string;
  email: string;
  configuration?: string;
  intent?: string;
  source?: string;
  notes?: string;
  customRecipient?: string;
  customSubject?: string;
  formTitle?: string;
}) {
  try {
    const config = await getSmtpSettings();
    if (!config || !config.enabled || !config.host || !config.user || !config.pass) {
      return; // SMTP disabled or incomplete
    }
    if (config.notify_on_lead === false) {
      return;
    }

    const recipients =
      lead.customRecipient?.trim() || config.admin_email?.trim() || config.user?.trim();
    if (!recipients) return;

    const transporter = createTransporter(config);
    const fromAddress = config.from_email?.trim() || config.user?.trim();
    const senderName = config.from_name?.trim() || 'Prestige Thane Desk';

    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const subject =
      lead.customSubject?.trim() ||
      `🚨 New Lead: ${lead.name || 'Homebuyer'} (${lead.formTitle || lead.configuration || 'Enquiry'})`;

    await transporter.sendMail({
      from: `"${senderName}" <${fromAddress}>`,
      to: recipients,
      subject,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 20px 24px; border-radius: 8px;">
            <div style="display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; background: #d97706; color: #ffffff; margin-bottom: 8px; text-transform: uppercase;">
              New Buyer Enquiry
            </div>
            <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff;">Prestige Thane Lead Alert</h2>
            <p style="margin: 4px 0 0; font-size: 13px; color: #94a3b8;">Received on ${timestamp} IST</p>
          </div>

          <div style="padding: 20px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tbody>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; font-weight: 600; color: #64748b; width: 140px;">Name</td>
                  <td style="padding: 10px 0; font-weight: 700; color: #0f172a;">${lead.name || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Phone Number</td>
                  <td style="padding: 10px 0; font-weight: 700; color: #0f172a;">
                    <a href="tel:${lead.phone}" style="color: #2563eb; text-decoration: none;">${lead.phone}</a>
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Email Address</td>
                  <td style="padding: 10px 0; color: #0f172a;">
                    <a href="mailto:${lead.email}" style="color: #2563eb; text-decoration: none;">${lead.email}</a>
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Configuration</td>
                  <td style="padding: 10px 0; color: #0f172a;">${lead.configuration || '2 BHK'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Intent / Purpose</td>
                  <td style="padding: 10px 0; color: #0f172a;">${lead.intent || 'Site Visit'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Form Source</td>
                  <td style="padding: 10px 0; color: #0f172a;">${lead.source || 'Website'}</td>
                </tr>
                ${
                  lead.notes
                    ? `<tr>
                        <td style="padding: 10px 0; font-weight: 600; color: #64748b; vertical-align: top;">Notes / Message</td>
                        <td style="padding: 10px 0; color: #334155; line-height: 1.5;">${lead.notes}</td>
                      </tr>`
                    : ''
                }
              </tbody>
            </table>
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; display: flex; justify-content: space-between; align-items: center;">
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">
              Logged into MongoDB & Supabase CRM automatically.
            </p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error('Failed to send lead email notification:', err);
  }
}

export async function sendUserAutoReplyEmail(params: {
  to: string;
  name?: string;
  subject?: string;
  message?: string;
  configuration?: string;
}) {
  try {
    const config = await getSmtpSettings();
    if (!config || !config.enabled || !config.host || !config.user || !config.pass) {
      return;
    }
    if (!params.to || !params.to.includes('@')) {
      return;
    }

    const transporter = createTransporter(config);
    const fromAddress = config.from_email?.trim() || config.user?.trim();
    const senderName = config.from_name?.trim() || 'Prestige Thane Official';

    const subject = params.subject?.trim() || 'Thank you for your enquiry - Prestige Thane';
    const message =
      params.message?.trim() ||
      'Thank you for reaching out to us. We have received your request and our project specialist will get in touch with you shortly with full project details.';

    await transporter.sendMail({
      from: `"${senderName}" <${fromAddress}>`,
      to: params.to.trim(),
      subject,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 24px; border-radius: 8px; text-align: center;">
            <div style="display: inline-block; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; background: #d97706; color: #ffffff; margin-bottom: 8px; text-transform: uppercase;">
              Pre-Launch Notification
            </div>
            <h2 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff;">Prestige Thane</h2>
            <p style="margin: 6px 0 0; font-size: 13px; color: #94a3b8;">Luxury Living in the Heart of Thane</p>
          </div>

          <div style="padding: 24px 8px;">
            <h3 style="margin: 0 0 12px; font-size: 16px; color: #0f172a;">Dear ${params.name || 'Valued Homebuyer'},</h3>
            <p style="font-size: 14px; color: #334155; line-height: 1.6; white-space: pre-wrap; margin: 0 0 16px;">${message}</p>

            ${
              params.configuration
                ? `
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-top: 16px;">
                <div style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Enquiry Summary</div>
                <div style="margin-top: 6px; font-size: 14px; color: #0f172a;"><strong>Preferred Layout:</strong> ${params.configuration}</div>
              </div>
            `
                : ''
            }
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 8px; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">
              Prestige Group • Balkum, Kapurbawadi, Thane West, Maharashtra
            </p>
            <p style="margin: 4px 0 0; font-size: 11px; color: #cbd5e1;">
              This is an automated confirmation sent to ${params.to}.
            </p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error('Failed to send user auto-reply email:', err);
  }
}

export async function sendContactNotificationEmail(contact: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  try {
    const config = await getSmtpSettings();
    if (!config || !config.enabled || !config.host || !config.user || !config.pass) {
      return;
    }
    if (config.notify_on_contact === false) {
      return;
    }

    const recipients = config.admin_email?.trim() || config.user?.trim();
    if (!recipients) return;

    const transporter = createTransporter(config);
    const fromAddress = config.from_email?.trim() || config.user?.trim();
    const senderName = config.from_name?.trim() || 'Prestige Thane Desk';

    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    await transporter.sendMail({
      from: `"${senderName}" <${fromAddress}>`,
      to: recipients,
      subject: `📬 Contact Query: ${contact.subject || contact.name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 20px 24px; border-radius: 8px;">
            <div style="display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; background: #2563eb; color: #ffffff; margin-bottom: 8px; text-transform: uppercase;">
              Contact Form Query
            </div>
            <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff;">New Message from ${contact.name}</h2>
            <p style="margin: 4px 0 0; font-size: 13px; color: #94a3b8;">Received on ${timestamp} IST</p>
          </div>

          <div style="padding: 20px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tbody>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; font-weight: 600; color: #64748b; width: 140px;">From Name</td>
                  <td style="padding: 10px 0; font-weight: 700; color: #0f172a;">${contact.name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Email Address</td>
                  <td style="padding: 10px 0; color: #0f172a;">
                    <a href="mailto:${contact.email}" style="color: #2563eb; text-decoration: none;">${contact.email}</a>
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; font-weight: 600; color: #64748b;">Subject</td>
                  <td style="padding: 10px 0; color: #0f172a;">${contact.subject || 'General Inquiry'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: 600; color: #64748b; vertical-align: top;">Message</td>
                  <td style="padding: 10px 0; color: #334155; line-height: 1.6; white-space: pre-wrap;">${contact.message}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 16px;">
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">
              You can reply directly to <a href="mailto:${contact.email}" style="color: #2563eb;">${contact.email}</a>.
            </p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error('Failed to send contact email notification:', err);
  }
}

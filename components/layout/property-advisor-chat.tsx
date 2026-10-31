'use client';

import React, { useState, useEffect } from 'react';
import { X, Send, ArrowRight, MessageSquare, Sparkles } from 'lucide-react';

export interface AdvisorItem {
  id: string;
  name: string;
  role: string;
  phone: string;
  avatar: string;
  status: string;
}

interface AdvisorChatProps {
  projectTitle?: string;
  whatsappNumber?: string;
  initialEnabled?: boolean;
}

export function PropertyAdvisorChat({
  projectTitle = 'Prestige Thane',
  whatsappNumber = '919022222448',
  initialEnabled = true,
}: AdvisorChatProps) {
  const [isEnabled, setIsEnabled] = useState(initialEnabled);
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [deskTitle, setDeskTitle] = useState('Prestige Thane Desk');
  const [subtitle, setSubtitle] = useState('Pre-Launch Advisor Online');
  const [welcomeTitle, setWelcomeTitle] = useState('Welcome to Prestige Thane!');
  const [welcomeMsg, setWelcomeMsg] = useState(
    'Prestige Thane is an upcoming pre-launch project. Register your interest to get official updates on launch timing, pricing, and layout updates.'
  );
  const [action1, setAction1] = useState('Request Price Updates');
  const [action2, setAction2] = useState('Request Master & Floor Plan Layouts');
  const [liveWaNumber, setLiveWaNumber] = useState(whatsappNumber);
  const [message, setMessage] = useState('Hi, I would like to receive pre-launch early access updates');
  const [advisors, setAdvisors] = useState<AdvisorItem[]>([]);

  useEffect(() => {
    const fetchSettings = () => {
      // Fetch live theme & project info dynamically during idle time
      fetch('/api/settings/theme', { cache: 'default' })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            if (data.advisor_chat_enabled !== undefined) setIsEnabled(data.advisor_chat_enabled);
            if (data.advisor_chat_title) setDeskTitle(data.advisor_chat_title);
            else if (data.project_title) setDeskTitle(`${data.project_title} Desk`);

            if (data.advisor_chat_subtitle) setSubtitle(data.advisor_chat_subtitle);

            if (data.advisor_chat_welcome_title) setWelcomeTitle(data.advisor_chat_welcome_title);
            else if (data.project_title) setWelcomeTitle(`Welcome to ${data.project_title}!`);

            if (data.advisor_chat_welcome_msg) setWelcomeMsg(data.advisor_chat_welcome_msg);
            if (data.advisor_chat_action_1) setAction1(data.advisor_chat_action_1);
            if (data.advisor_chat_action_2) setAction2(data.advisor_chat_action_2);

            if (data.advisor_chat_prefill) setMessage(data.advisor_chat_prefill);

            if (Array.isArray(data.advisor_chat_advisors) && data.advisor_chat_advisors.length > 0) {
              setAdvisors(data.advisor_chat_advisors);
            }

            const phoneToUse = data.advisor_chat_whatsapp || data.navbar_phone;
            if (phoneToUse) {
              const clean = phoneToUse.replace(/\D/g, '');
              if (clean.length >= 10) setLiveWaNumber(clean.startsWith('91') ? clean : `91${clean}`);
            }
          }
        })
        .catch(() => {});
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = (window as any).requestIdleCallback(fetchSettings, { timeout: 1500 });
      return () => {
        if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
          (window as any).cancelIdleCallback(id);
        }
      };
    } else {
      const timer = setTimeout(fetchSettings, 200);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isEnabled) return null;

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false);
    }
  };

  const handleSendToAdvisor = (advisor?: AdvisorItem, customText?: string) => {
    const textToSend = (customText || message).trim();
    if (!textToSend) return;

    const phoneToUse = advisor?.phone || liveWaNumber;
    const clean = phoneToUse.replace(/\D/g, '');
    const finalPhone = clean.length >= 10 ? (clean.startsWith('91') ? clean : `91${clean}`) : clean;

    // Log the lead inquiry in background
    try {
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Advisor Chat Visitor',
          phone: finalPhone,
          email: 'advisor.chat@inquiry.com',
          configuration: 'All Units',
          intent: advisor ? `WhatsApp Chat with ${advisor.name}` : 'WhatsApp Chat Inquiry',
          source: `Property Advisor Chat Desk (${deskTitle})`,
          notes: advisor
            ? `Assigned Advisor: ${advisor.name} (${advisor.role}) - Query: "${textToSend}"`
            : `Visitor Query: "${textToSend}"`,
        }),
      }).catch(() => {});
    } catch {}

    const advisorGreeting = advisor ? `Hello ${advisor.name}, ` : '';
    const encoded = encodeURIComponent(
      `${advisorGreeting}${textToSend} for ${deskTitle}. Please share pricing, floor plans, and launch details.`
    );
    const targetUrl = `https://api.whatsapp.com/send?phone=${finalPhone}&text=${encoded}`;
    window.open(targetUrl, '_blank');
  };

  const handleSend = (customText?: string) => {
    handleSendToAdvisor(advisors[0], customText);
  };

  const handleQuickAction = (actionTitle: string) => {
    const query = `Hi, I would like to ${actionTitle.toLowerCase()}`;
    setMessage(query);
    handleSend(query);
  };

  return (
    <aside aria-label="Live Property Advisor Desk" className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none">
      {/* ───────────────── CHAT WINDOW CARD ───────────────── */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Prestige Property Advisor Chat"
          className="mb-3 w-[330px] sm:w-[360px] rounded-2xl overflow-hidden bg-white shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-slate-200/90 animate-in fade-in slide-in-from-bottom-4 duration-200 flex flex-col"
        >
          {/* Green Header */}
          <div className="bg-[#008A5E] px-4 py-3.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-white fill-none stroke-current stroke-2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h4 className="font-bold text-sm tracking-tight leading-tight">
                  {deskTitle}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 ring-2 ring-emerald-400/50" />
                  <span className="text-[11px] text-emerald-100 font-medium">
                    {subtitle}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-3.5 bg-slate-50/70 space-y-2.5 max-h-[380px] overflow-y-auto">
            {/* Welcome Agent Message Bubble */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
              <h5 className="font-bold text-slate-900 text-xs tracking-tight">
                {welcomeTitle}
              </h5>
              <p className="text-[11.5px] text-slate-600 leading-relaxed">
                {welcomeMsg}
              </p>
              <div className="text-right pt-0.5">
                <span className="text-[10px] text-slate-400 font-medium">Just now</span>
              </div>
            </div>

            {/* Multiple Advisors List */}
            {advisors.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10.5px] font-bold text-slate-600 uppercase tracking-wider block px-1">
                  Connect with an Advisor:
                </span>
                <div className="space-y-1.5">
                  {advisors.map((adv) => (
                    <button
                      key={adv.id}
                      type="button"
                      onClick={() => handleSendToAdvisor(adv)}
                      className="w-full p-2.5 rounded-xl border border-slate-200/90 bg-white hover:bg-emerald-50/60 hover:border-emerald-300 transition-all flex items-center justify-between gap-2.5 text-left group shadow-2xs cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              adv.avatar ||
                              'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
                            }
                            alt={adv.name}
                            className="w-9 h-9 rounded-full object-cover border border-emerald-500/40"
                          />
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                        </div>
                        <div className="min-w-0">
                          <h6 className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                            {adv.name}
                          </h6>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-500 truncate">
                              {adv.role || 'Property Specialist'}
                            </span>
                            {adv.status && (
                              <span className="text-[9px] text-emerald-600 font-medium bg-emerald-50 px-1 py-0.2 rounded">
                                {adv.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 px-2.5 py-1 rounded-lg bg-emerald-600 text-white group-hover:bg-emerald-700 transition-colors text-[10.5px] font-semibold">
                        <span>Chat</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Action Pill 1 */}
            {action1 && (
              <button
                type="button"
                onClick={() => handleQuickAction(action1)}
                className="w-full p-2.5 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100/80 text-amber-900 font-semibold text-xs flex items-center justify-between transition-all cursor-pointer shadow-2xs group text-left"
              >
                <span className="font-bold text-amber-950">{action1}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-700 transition-transform group-hover:translate-x-0.5" />
              </button>
            )}

            {/* Quick Action Pill 2 */}
            {action2 && (
              <button
                type="button"
                onClick={() => handleQuickAction(action2)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100/70 hover:bg-slate-200/70 text-slate-800 font-semibold text-xs flex items-center justify-between transition-all cursor-pointer shadow-2xs group text-left"
              >
                <span className="font-bold text-slate-900">{action2}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 transition-transform group-hover:translate-x-0.5" />
              </button>
            )}
          </div>

          {/* Bottom Input Area */}
          <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008A5E]/20 focus:border-[#008A5E] transition"
            />

            <button
              type="button"
              onClick={() => handleSend()}
              className="w-9 h-9 rounded-xl bg-[#00A86B] hover:bg-[#008A5E] text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-sm cursor-pointer"
              title="Send to Advisor on WhatsApp"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      )}

      {/* ───────────────── FLOATING CIRCLE BUTTON ───────────────── */}
      <div className="flex items-center">
        {/* Floating Circle Button without hover tooltip pill */}
        <button
          type="button"
          onClick={handleToggle}
          className="relative w-14 h-14 rounded-full bg-[#00A86B] hover:bg-[#00965F] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(0,168,107,0.35)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          aria-label="Open Live Advisor WhatsApp Chat"
        >
          {/* Custom White Chat Bubble Outline matching screenshot */}
          <svg
            viewBox="0 0 24 24"
            className="w-7 h-7 text-white fill-none stroke-current stroke-[2.2]"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>

          {/* Yellow/Amber Unread Notification Badge Dot */}
          {hasUnread && (
            <span
              className="absolute top-0 right-0 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-white shadow-xs ring-2 ring-amber-400/50"
              title="New message from advisor"
            />
          )}
        </button>
      </div>
    </aside>
  );
}

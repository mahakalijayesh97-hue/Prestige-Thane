'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import {
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  MessageCircle,
  Download,
  RefreshCw,
  Trash2,
  Eye,
  CheckCircle2,
  Search,
  Home,
  Clock,
  User,
  X,
  Loader2,
  Sparkles,
  CheckCheck,
  MailOpen,
  ArrowUpRight,
  SlidersHorizontal,
} from 'lucide-react';

interface LeadItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  configuration: string;
  intent: string;
  source: string;
  notes?: string;
  is_read?: boolean;
  status?: string;
  created_at: string;
}

export default function AdminContactPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'visits' | 'chat' | 'whatsapp' | 'brochure'>('all');
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    setLoading(true);
    try {
      const res = await fetch('/api/leads', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setLeads(json.leads || []);
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLoading(false);
    }
  }

  // Toggle Read / Unread Status
  async function toggleReadStatus(lead: LeadItem, e?: React.MouseEvent) {
    if (e) e.stopPropagation();
    const newStatus = !lead.is_read;

    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, is_read: newStatus } : l))
    );
    if (selectedLead?.id === lead.id) {
      setSelectedLead((prev) => (prev ? { ...prev, is_read: newStatus } : null));
    }

    try {
      await fetch('/api/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, is_read: newStatus }),
      });

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: newStatus ? 'Marked as Read' : 'Marked as Unread',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.error('Failed to update lead status:', err);
    }
  }

  // Delete Lead with SweetAlert2
  async function deleteLead(lead: LeadItem, e?: React.MouseEvent) {
    if (e) e.stopPropagation();

    const result = await Swal.fire({
      title: 'Delete this message?',
      text: `Are you sure you want to delete inquiry from "${lead.name}"? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      showDenyButton: false,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/leads?id=${lead.id}`, { method: 'DELETE' });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== lead.id));
        if (selectedLead?.id === lead.id) setSelectedLead(null);

        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The inquiry message has been deleted.',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error('Failed to delete lead:', err);
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: 'Could not delete this inquiry. Please try again.',
      });
    }
  }

  // Export CSV
  function exportCSV() {
    if (leads.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No Data',
        text: 'There are no inquiries to export.',
      });
      return;
    }

    const headers = ['Date', 'Name', 'Phone', 'Email', 'Configuration', 'Intent', 'Source', 'Notes', 'Read'];
    const rows = leads.map((l) => [
      new Date(l.created_at).toLocaleString(),
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.configuration}"`,
      `"${(l.intent || '').replace(/"/g, '""')}"`,
      `"${(l.source || '').replace(/"/g, '""')}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      l.is_read ? 'Yes' : 'No',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Exported Leads to CSV',
      showConfirmButton: false,
      timer: 2000,
    });
  }

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // 1. Text Search Filter
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        lead.name.toLowerCase().includes(q) ||
        lead.phone.includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        lead.configuration.toLowerCase().includes(q) ||
        (lead.intent && lead.intent.toLowerCase().includes(q)) ||
        (lead.notes && lead.notes.toLowerCase().includes(q));

      if (!matchSearch) return false;

      // 2. Tab Filter
      if (activeFilter === 'unread') return !lead.is_read;
      if (activeFilter === 'visits') {
        const text = ((lead.intent || '') + ' ' + (lead.source || '')).toLowerCase();
        return text.includes('visit');
      }
      if (activeFilter === 'chat') {
        const text = ((lead.intent || '') + ' ' + (lead.source || '')).toLowerCase();
        return text.includes('advisor') || text.includes('chat') || text.includes('desk');
      }
      if (activeFilter === 'whatsapp') {
        const text = ((lead.intent || '') + ' ' + (lead.source || '')).toLowerCase();
        return text.includes('whatsapp');
      }
      if (activeFilter === 'brochure') {
        const text = ((lead.intent || '') + ' ' + (lead.source || '')).toLowerCase();
        return text.includes('brochure');
      }

      return true;
    });
  }, [leads, search, activeFilter]);

  // Quick KPI Counts
  const totalCount = leads.length;
  const unreadCount = leads.filter((l) => !l.is_read).length;
  const siteVisitsCount = leads.filter((l) =>
    ((l.intent || '') + ' ' + (l.source || '')).toLowerCase().includes('visit')
  ).length;
  const chatCount = leads.filter((l) =>
    ((l.intent || '') + ' ' + (l.source || '')).toLowerCase().includes('advisor') ||
    ((l.intent || '') + ' ' + (l.source || '')).toLowerCase().includes('chat') ||
    ((l.intent || '') + ' ' + (l.source || '')).toLowerCase().includes('desk')
  ).length;
  const whatsappCount = leads.filter((l) =>
    ((l.intent || '') + ' ' + (l.source || '')).toLowerCase().includes('whatsapp')
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Breadcrumb Navigation matching Forms Builder */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
        <Link href="/admin" className="hover:text-slate-600 transition-colors">
          <Home className="w-3.5 h-3.5" />
        </Link>
        <span>/</span>
        <span className="text-slate-600 font-semibold">Messages &amp; Inquiries</span>
      </div>

      {/* Page Header matching Forms & Modals style */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600 shrink-0 shadow-2xs">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Messages &amp; Lead Inquiries
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              View customer inquiries, site visit bookings, WhatsApp requests, and contact messages in real time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={exportCSV}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" /> Export CSV
          </button>
          <button
            onClick={loadLeads}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* 4 KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Leads */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Inquiries</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Mail className="w-5 h-5" />
          </div>
        </div>

        {/* Unread / New */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">New / Unread</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">{unreadCount}</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Site Visits */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Site Visits</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{siteVisitsCount}</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* WhatsApp Requests */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">WhatsApp Leads</p>
            <h3 className="text-2xl font-bold text-teal-600 mt-1">{whatsappCount}</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, phone, email, unit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(
            [
              { key: 'all', label: 'All Inquiries', count: totalCount },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'visits', label: 'Site Visits', count: siteVisitsCount },
              { key: 'chat', label: 'Advisor Chat', count: chatCount },
              { key: 'whatsapp', label: 'WhatsApp', count: whatsappCount },
              { key: 'brochure', label: 'Brochure', count: leads.filter((l) => (l.intent || '').toLowerCase().includes('brochure')).length },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeFilter === tab.key
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeFilter === tab.key
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200/80 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Leads Inquiries Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-16 text-center text-sm text-slate-500 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
          <span className="font-medium">Loading customer messages &amp; inquiries...</span>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Inquiries Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {search || activeFilter !== 'all'
              ? 'Try adjusting your search query or switching active filters.'
              : 'New lead submissions from website forms and modals will automatically appear here.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Buyer / Lead</th>
                  <th className="py-3.5 px-4">Phone / WhatsApp</th>
                  <th className="py-3.5 px-4">Intent &amp; Action</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredLeads.map((lead) => {
                  const isAdvisorChat =
                    ((lead.source || '') + ' ' + (lead.intent || '')).toLowerCase().includes('advisor') ||
                    ((lead.source || '') + ' ' + (lead.intent || '')).toLowerCase().includes('chat') ||
                    ((lead.source || '') + ' ' + (lead.intent || '')).toLowerCase().includes('desk');
                  const isVisit = (lead.intent || '').toLowerCase().includes('visit');
                  const isWhatsApp = (lead.intent || '').toLowerCase().includes('whatsapp');
                  const cleanPhone = lead.phone.replace(/\D/g, '');

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`hover:bg-slate-50/80 transition cursor-pointer ${
                        !lead.is_read ? 'bg-amber-50/30 font-semibold' : ''
                      }`}
                    >
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100/80 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                            {lead.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-slate-900 font-bold">{lead.name}</div>
                            <div className="text-slate-500 text-[11px]">{lead.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`tel:${cleanPhone}`}
                            className="font-mono text-slate-800 hover:text-blue-600 hover:underline"
                          >
                            +91 {cleanPhone.slice(-10)}
                          </a>
                          <a
                            href={`https://api.whatsapp.com/send?phone=91${cleanPhone.slice(-10)}&text=Hi%20${encodeURIComponent(lead.name)},%20thank%20you%20for%20your%20interest%20in%20Prestige%20Thane.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Direct WhatsApp Message"
                            className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 transition"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      {/* Intent & Action */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                isAdvisorChat
                                  ? 'bg-emerald-100/90 text-emerald-900 border border-emerald-300'
                                  : isVisit
                                  ? 'bg-amber-100/90 text-amber-900 border border-amber-300'
                                  : isWhatsApp
                                  ? 'bg-teal-100/90 text-teal-900 border border-teal-300'
                                  : 'bg-blue-100/80 text-blue-800 border border-blue-200'
                              }`}
                            >
                              {isAdvisorChat ? (
                                <MessageCircle className="w-3 h-3 text-emerald-700" />
                              ) : isVisit ? (
                                <Calendar className="w-3 h-3 text-amber-700" />
                              ) : isWhatsApp ? (
                                <MessageSquare className="w-3 h-3 text-teal-700" />
                              ) : (
                                <Mail className="w-3 h-3 text-blue-700" />
                              )}
                              <span>
                                {isAdvisorChat
                                  ? 'Advisor Desk Chat'
                                  : lead.intent || 'Schedule Site Visit'}
                              </span>
                            </span>

                            {lead.configuration && (
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200/80">
                                {lead.configuration}
                              </span>
                            )}
                          </div>

                          {lead.notes && (
                            <div className="text-[11px] text-slate-500 max-w-xs truncate italic" title={lead.notes}>
                              {lead.notes.replace(/^Visitor Query:\s*"?/, '').replace(/"?$/, '')}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status (Read / New) */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            lead.is_read
                              ? 'bg-slate-100 text-slate-500'
                              : 'bg-amber-500 text-white shadow-2xs'
                          }`}
                        >
                          {lead.is_read ? 'Read' : 'New'}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(lead.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            title="View Full Details"
                            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => toggleReadStatus(lead, e)}
                            title={lead.is_read ? 'Mark as Unread' : 'Mark as Read'}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-amber-600 hover:bg-slate-50 transition cursor-pointer"
                          >
                            {lead.is_read ? <Mail className="w-3.5 h-3.5" /> : <CheckCheck className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={(e) => deleteLead(lead, e)}
                            title="Delete Message"
                            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Lead Details Modal Dialog */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-base">
                  {selectedLead.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedLead.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {new Date(selectedLead.created_at).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inquired Info Grid */}
            <div className="grid grid-cols-2 gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
              {selectedLead.configuration ? (
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Configuration
                  </span>
                  <span className="font-bold text-slate-900 mt-0.5 inline-block">
                    {selectedLead.configuration}
                  </span>
                </div>
              ) : null}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Source Channel
                </span>
                <span className="font-semibold text-slate-700 mt-0.5 inline-block">
                  {selectedLead.source || 'Website'}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Mobile Number
                </span>
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="font-mono font-bold text-blue-600 hover:underline mt-0.5 inline-block"
                >
                  +91 {selectedLead.phone}
                </a>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Email Address
                </span>
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="font-semibold text-blue-600 hover:underline mt-0.5 inline-block truncate"
                >
                  {selectedLead.email}
                </a>
              </div>
            </div>

            {/* Message Notes */}
            {selectedLead.notes && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 block">
                  Customer Notes &amp; Form Data:
                </span>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-mono whitespace-pre-wrap">
                  {selectedLead.notes}
                </div>
              </div>
            )}

            {/* Quick Actions Row */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <a
                  href={`https://api.whatsapp.com/send?phone=91${selectedLead.phone.replace(/\D/g, '').slice(-10)}&text=Hi%20${encodeURIComponent(selectedLead.name)},%20regarding%20your%20inquiry%20for%20Prestige%20Thane.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                </a>
                <a
                  href={`tel:${selectedLead.phone.replace(/\D/g, '')}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-600" /> Call
                </a>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleReadStatus(selectedLead)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  {selectedLead.is_read ? <Mail className="w-3.5 h-3.5" /> : <CheckCheck className="w-3.5 h-3.5" />}
                  {selectedLead.is_read ? 'Mark Unread' : 'Mark Read'}
                </button>
                <button
                  type="button"
                  onClick={() => deleteLead(selectedLead)}
                  className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

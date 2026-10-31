'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
// @ts-ignore -- SweetAlert2's CSS file has no TypeScript module declaration.
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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CheckSquare,
  Square,
  MinusSquare,
  Copy,
  ExternalLink,
  Filter,
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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Bulk selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

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
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/leads?id=${lead.id}`, { method: 'DELETE' });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== lead.id));
        setSelectedIds((prev) => prev.filter((id) => id !== lead.id));
        if (selectedLead?.id === lead.id) setSelectedLead(null);

        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Inquiry deleted',
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

  // Bulk actions
  const bulkMarkRead = async (isRead: boolean) => {
    if (selectedIds.length === 0) return;
    setLeads((prev) =>
      prev.map((l) => (selectedIds.includes(l.id) ? { ...l, is_read: isRead } : l))
    );
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch('/api/leads', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, is_read: isRead }),
          })
        )
      );
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Marked ${selectedIds.length} as ${isRead ? 'Read' : 'Unread'}`,
        showConfirmButton: false,
        timer: 1500,
      });
      setSelectedIds([]);
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to update some inquiries' });
    }
  };

  const bulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const res = await Swal.fire({
      title: `Delete ${selectedIds.length} inquiries?`,
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: `Yes, delete ${selectedIds.length}`,
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });
    if (!res.isConfirmed) return;

    setLeads((prev) => prev.filter((l) => !selectedIds.includes(l.id)));
    try {
      await Promise.all(
        selectedIds.map((id) => fetch(`/api/leads?id=${id}`, { method: 'DELETE' }))
      );
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Deleted ${selectedIds.length} inquiries`,
        showConfirmButton: false,
        timer: 1500,
      });
      setSelectedIds([]);
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to delete some inquiries' });
    }
  };

  // Copy phone number
  const copyPhoneNumber = (phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 1500);
  };

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

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [search, activeFilter, pageSize]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredLeads.length);
  const paginatedLeads = useMemo(() => {
    return filteredLeads.slice(startIndex, endIndex);
  }, [filteredLeads, startIndex, endIndex]);

  // Selection helpers
  const allCurrentPageSelected =
    paginatedLeads.length > 0 && paginatedLeads.every((l) => selectedIds.includes(l.id));
  const someCurrentPageSelected =
    paginatedLeads.some((l) => selectedIds.includes(l.id)) && !allCurrentPageSelected;

  const toggleSelectAll = () => {
    if (allCurrentPageSelected) {
      setSelectedIds((prev) => prev.filter((id) => !paginatedLeads.some((l) => l.id === id)));
    } else {
      const pageIds = paginatedLeads.map((l) => l.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleSelectOne = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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

  // Pagination Page Number Array
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  }, [totalPages, currentPage]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
        <Link href="/admin" className="hover:text-slate-600 transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-semibold">Messages &amp; Inquiries</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#4F46E5] flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Messages &amp; Lead Inquiries
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                Live Inbox
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              View customer inquiries, site visit bookings, WhatsApp requests, and contact messages in real time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <button
            onClick={exportCSV}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs transition cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={loadLeads}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 4 Interactive KPI Stat Cards (Clickable filter shortcuts) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inquiries */}
        <div
          onClick={() => setActiveFilter('all')}
          className={`bg-white rounded-2xl border p-5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md ${
            activeFilter === 'all' ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200/90'
          }`}
        >
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Inquiries</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</h3>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">All incoming leads</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
            <Mail className="w-6 h-6" />
          </div>
        </div>

        {/* Unread / New */}
        <div
          onClick={() => setActiveFilter('unread')}
          className={`bg-white rounded-2xl border p-5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md ${
            activeFilter === 'unread' ? 'border-amber-500 ring-2 ring-amber-500/10' : 'border-slate-200/90'
          }`}
        >
          <div>
            <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">New / Unread</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">{unreadCount}</h3>
            <span className="text-[10px] text-amber-600/70 font-medium mt-0.5 block">Requires attention</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Site Visits */}
        <div
          onClick={() => setActiveFilter('visits')}
          className={`bg-white rounded-2xl border p-5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md ${
            activeFilter === 'visits' ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-200/90'
          }`}
        >
          <div>
            <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Site Visits</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{siteVisitsCount}</h3>
            <span className="text-[10px] text-emerald-600/70 font-medium mt-0.5 block">Bookings scheduled</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* WhatsApp Leads */}
        <div
          onClick={() => setActiveFilter('whatsapp')}
          className={`bg-white rounded-2xl border p-5 shadow-2xs flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md ${
            activeFilter === 'whatsapp' ? 'border-teal-500 ring-2 ring-teal-500/10' : 'border-slate-200/90'
          }`}
        >
          <div>
            <p className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">WhatsApp Leads</p>
            <h3 className="text-2xl font-bold text-teal-600 mt-1">{whatsappCount}</h3>
            <span className="text-[10px] text-teal-600/70 font-medium mt-0.5 block">Direct mobile chats</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shadow-xs">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, phone, email, unit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
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
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                activeFilter === tab.key
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeFilter === tab.key
                    ? 'bg-white/25 text-white'
                    : 'bg-slate-200/80 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Action Bar (Visible when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
            <CheckSquare className="w-4 h-4 text-indigo-600" />
            <span>{selectedIds.length} of {filteredLeads.length} inquiries selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => bulkMarkRead(true)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-indigo-200 text-indigo-900 text-xs font-semibold shadow-2xs transition cursor-pointer flex items-center gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mark as Read</span>
            </button>

            <button
              type="button"
              onClick={() => bulkMarkRead(false)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-indigo-200 text-indigo-900 text-xs font-semibold shadow-2xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-amber-600" />
              <span>Mark as Unread</span>
            </button>

            <button
              type="button"
              onClick={bulkDelete}
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-2xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1.5 text-xs text-indigo-700 hover:text-indigo-950 font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Leads Inquiries Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-16 text-center text-sm text-slate-500 flex flex-col items-center justify-center gap-3 shadow-xs">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="font-semibold text-slate-700">Loading customer inquiries...</span>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-2xs">
            <Mail className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Inquiries Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {search || activeFilter !== 'all'
              ? 'No leads match your current search or filter criteria. Try resetting your search or selecting "All Inquiries".'
              : 'New lead submissions from website forms, modals, and the live advisor chat will automatically appear here.'}
          </p>
          {(search || activeFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setActiveFilter('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition shadow-xs"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 w-10">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="text-slate-400 hover:text-indigo-600 cursor-pointer flex items-center"
                    >
                      {allCurrentPageSelected ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600" />
                      ) : someCurrentPageSelected ? (
                        <MinusSquare className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3.5 px-4">Buyer / Lead</th>
                  <th className="py-3.5 px-4">Phone / WhatsApp</th>
                  <th className="py-3.5 px-4">Intent &amp; Action</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {paginatedLeads.map((lead) => {
                  const isAdvisorChat =
                    ((lead.source || '') + ' ' + (lead.intent || '')).toLowerCase().includes('advisor') ||
                    ((lead.source || '') + ' ' + (lead.intent || '')).toLowerCase().includes('chat') ||
                    ((lead.source || '') + ' ' + (lead.intent || '')).toLowerCase().includes('desk');
                  const isVisit = (lead.intent || '').toLowerCase().includes('visit');
                  const isWhatsApp = (lead.intent || '').toLowerCase().includes('whatsapp');
                  const cleanPhone = lead.phone.replace(/\D/g, '');
                  const isSelected = selectedIds.includes(lead.id);

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`hover:bg-blue-50/30 transition-colors cursor-pointer group ${
                        !lead.is_read ? 'bg-amber-50/25 font-semibold' : ''
                      } ${isSelected ? 'bg-indigo-50/40' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 w-10" onClick={(e) => toggleSelectOne(lead.id, e)}>
                        <button type="button" className="text-slate-400 hover:text-indigo-600 cursor-pointer flex items-center">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
                          )}
                        </button>
                      </td>

                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-2xs">
                            {lead.name ? lead.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div className="min-w-0">
                            <div className="text-slate-900 font-bold truncate max-w-[180px]">{lead.name}</div>
                            <div className="text-slate-500 text-[11px] truncate max-w-[180px]">{lead.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`tel:${cleanPhone}`}
                            className="font-mono text-slate-800 hover:text-blue-600 hover:underline font-semibold"
                          >
                            +91 {cleanPhone.slice(-10)}
                          </a>
                          <button
                            type="button"
                            onClick={(e) => copyPhoneNumber(`+91 ${cleanPhone.slice(-10)}`, e)}
                            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                            title="Copy Phone Number"
                          >
                            {copiedPhone === `+91 ${cleanPhone.slice(-10)}` ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
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
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
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
                            <div className="text-[11px] text-slate-500 max-w-sm truncate italic" title={lead.notes}>
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
                          {!lead.is_read && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                          {lead.is_read ? 'Read' : 'New'}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-xs">
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
                            type="button"
                            onClick={() => setSelectedLead(lead)}
                            title="View Full Details"
                            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => toggleReadStatus(lead, e)}
                            title={lead.is_read ? 'Mark as Unread' : 'Mark as Read'}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-amber-600 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
                          >
                            {lead.is_read ? <Mail className="w-3.5 h-3.5" /> : <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => deleteLead(lead, e)}
                            title="Delete Message"
                            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition cursor-pointer shadow-2xs"
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

          {/* ─── COMPLETE MODERN PAGINATION BAR ─── */}
          <div className="bg-slate-50/80 border-t border-slate-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-600">
            {/* Left Info: Showing entries */}
            <div className="flex items-center gap-2 font-medium">
              <span>
                Showing <strong className="text-slate-900 font-bold">{filteredLeads.length > 0 ? startIndex + 1 : 0}</strong> to{' '}
                <strong className="text-slate-900 font-bold">{endIndex}</strong> of{' '}
                <strong className="text-slate-900 font-bold">{filteredLeads.length}</strong> inquiries
              </span>
            </div>

            {/* Right Controls: Rows per page & Navigation Buttons */}
            <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
              {/* Rows Per Page Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 text-[11px] font-medium">Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                >
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                </select>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center gap-1">
                {/* First Page */}
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white flex items-center justify-center transition cursor-pointer disabled:cursor-not-allowed shadow-2xs"
                  title="First Page"
                >
                  <ChevronsLeft className="w-3.5 h-3.5" />
                </button>

                {/* Prev Page */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white flex items-center gap-1 transition cursor-pointer disabled:cursor-not-allowed shadow-2xs font-semibold"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                {/* Page Number Buttons */}
                <div className="flex items-center gap-1">
                  {pageNumbers.map((num, idx) => {
                    if (num === '...') {
                      return (
                        <span key={`dots-${idx}`} className="px-1 text-slate-400 font-bold">
                          ...
                        </span>
                      );
                    }
                    const isCurrent = num === currentPage;
                    return (
                      <button
                        key={`page-${num}`}
                        type="button"
                        onClick={() => setCurrentPage(Number(num))}
                        className={`h-8 min-w-[32px] px-2 rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs ${
                          isCurrent
                            ? 'bg-blue-600 text-white shadow-blue-500/20'
                            : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>

                {/* Next Page */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white flex items-center gap-1 transition cursor-pointer disabled:cursor-not-allowed shadow-2xs font-semibold"
                  title="Next Page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {/* Last Page */}
                <button
                  type="button"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white flex items-center justify-center transition cursor-pointer disabled:cursor-not-allowed shadow-2xs"
                  title="Last Page"
                >
                  <ChevronsRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Lead Details Modal Dialog */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
                  {selectedLead.name ? selectedLead.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedLead.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
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
                type="button"
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inquired Info Grid */}
            <div className="grid grid-cols-2 gap-3.5 bg-slate-50/80 p-4 rounded-2xl border border-slate-100 text-xs">
              {selectedLead.configuration && (
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Configuration
                  </span>
                  <span className="font-bold text-slate-900 mt-0.5 inline-block">
                    {selectedLead.configuration}
                  </span>
                </div>
              )}
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
                  className="font-semibold text-blue-600 hover:underline mt-0.5 inline-block truncate max-w-[180px]"
                >
                  {selectedLead.email}
                </a>
              </div>
            </div>

            {/* Message Notes */}
            {selectedLead.notes && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-800 block">
                  Customer Query &amp; Form Data:
                </span>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {selectedLead.notes}
                </div>
              </div>
            )}

            {/* Quick Actions Row */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <a
                  href={`https://api.whatsapp.com/send?phone=91${selectedLead.phone.replace(/\D/g, '').slice(-10)}&text=Hi%20${encodeURIComponent(selectedLead.name)},%20regarding%20your%20inquiry%20for%20Prestige%20Thane.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:${selectedLead.phone.replace(/\D/g, '')}`}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  <span>Call Buyer</span>
                </a>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleReadStatus(selectedLead)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer active:scale-95"
                >
                  {selectedLead.is_read ? <Mail className="w-3.5 h-3.5 text-amber-600" /> : <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />}
                  <span>{selectedLead.is_read ? 'Mark Unread' : 'Mark Read'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => deleteLead(selectedLead)}
                  className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition cursor-pointer active:scale-95"
                  title="Delete Inquiry"
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

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Link2,
  Users,
  FormInput,
  ImageIcon,
  Compass,
  ArrowUpRight,
  Plus,
  RefreshCw,
  ExternalLink,
  Pencil,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  Activity,
  Sparkles,
  BarChart3,
  PieChart as PieIcon,
  Layers,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Globe,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface DashboardStats {
  totalPages: number;
  publishedPages: number;
  draftPages: number;
  totalOpenLinks: number;
  totalLeads: number;
  unreadLeads: number;
  totalForms: number;
  totalMedia: number;
  totalNavItems: number;
}

interface RecentPage {
  id: string;
  title: string;
  slug: string;
  status: string;
  is_homepage: boolean;
  updated_at: string;
}

interface RecentLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  configuration: string;
  intent: string;
  is_read: boolean;
  created_at: string;
}

const PIE_COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];

export default function DashboardClient() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPages, setRecentPages] = useState<RecentPage[]>([]);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const res = await fetch('/api/dashboard/stats', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecentPages(data.recentPages || []);
        setRecentLeads(data.recentLeads || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function handleRefresh() {
    setRefreshing(true);
    loadDashboardData();
  }

  // Chart data
  const contentBarData = [
    { name: 'Pages', count: stats?.totalPages ?? 0 },
    { name: 'Links', count: stats?.totalOpenLinks ?? 0 },
    { name: 'Forms', count: stats?.totalForms ?? 0 },
    { name: 'Media', count: stats?.totalMedia ?? 0 },
    { name: 'Leads', count: stats?.totalLeads ?? 0 },
  ];

  const pageStatusPieData = [
    { name: 'Published', value: stats?.publishedPages ?? 0 },
    { name: 'Draft', value: stats?.draftPages ?? 0 },
  ].filter((item) => item.value > 0);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">Loading live dashboard metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* ───────────────── HEADER: WELCOME & QUICK ACTIONS ───────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Prestige Thane Dashboard
            </h1>
            <Badge variant="outline" className="hidden sm:inline-flex gap-1 text-[11px] font-semibold text-emerald-600 border-emerald-500/30 bg-emerald-500/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Connected
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time content management, lead analytics, and infrastructure overview.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="gap-1.5 text-xs h-9"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>

          <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs h-9">
            <Link href="/" target="_blank">
              <ExternalLink className="h-3.5 w-3.5" />
              <span>View Site</span>
            </Link>
          </Button>

          <Button asChild size="sm" className="gap-1.5 text-xs h-9 font-medium shadow-sm">
            <Link href="/admin/pages/new">
              <Plus className="h-3.5 w-3.5" />
              <span>New Page</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* ───────────────── TOP DYNAMIC KPI STATS CARDS ───────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Total Pages */}
        <Card className="relative overflow-hidden border border-border/80 bg-card hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Pages
            </CardTitle>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{stats?.totalPages ?? 0}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] font-medium text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                {stats?.publishedPages ?? 0} Published
              </span>
              {(stats?.draftPages ?? 0) > 0 && (
                <span className="text-[11px] font-medium text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded">
                  {stats?.draftPages ?? 0} Draft
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Open Links */}
        <Card className="relative overflow-hidden border border-border/80 bg-card hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Open Links
            </CardTitle>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Link2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{stats?.totalOpenLinks ?? 0}</div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Page Routes &amp; Smooth Scrollers
            </p>
          </CardContent>
        </Card>

        {/* Customer Leads */}
        <Card className="relative overflow-hidden border border-border/80 bg-card hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Homebuyer Leads
            </CardTitle>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{stats?.totalLeads ?? 0}</div>
            <div className="mt-2">
              {(stats?.unreadLeads ?? 0) > 0 ? (
                <span className="text-[11px] font-semibold text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                  {stats?.unreadLeads} New Inquiries
                </span>
              ) : (
                <span className="text-[11px] text-muted-foreground">All inquiries reviewed</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Forms & Modals */}
        <Card className="relative overflow-hidden border border-border/80 bg-card hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Forms &amp; Modals
            </CardTitle>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <FormInput className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{stats?.totalForms ?? 0}</div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Lead capture popup modals
            </p>
          </CardContent>
        </Card>

        {/* Media Assets */}
        <Card className="relative overflow-hidden border border-border/80 bg-card hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Media Library
            </CardTitle>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <ImageIcon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{stats?.totalMedia ?? 0}</div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Floor plans, banners &amp; photos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ───────────────── CHARTS & VISUAL ANALYTICS ───────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Content Bar Chart */}
        <Card className="lg:col-span-2 border border-border/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Content Distribution
                </CardTitle>
                <CardDescription className="text-xs">
                  Real-time counts of modules and data records
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={contentBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 10,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Publication Status Donut Chart */}
        <Card className="border border-border/80">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-emerald-600" />
              Page Status
            </CardTitle>
            <CardDescription className="text-xs">
              Live vs Draft deployment status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pageStatusPieData.length === 0 ? (
              <div className="flex h-[260px] items-center justify-center text-xs text-muted-foreground">
                No page data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pageStatusPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                    paddingAngle={4}
                  >
                    {pageStatusPieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 10,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ───────────────── DETAILED 2-COLUMN DYNAMIC TABLES ───────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Panel 1: Recent Leads / Enquiries */}
        <Card className="border border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-600" />
                Recent Homebuyer Inquiries
              </CardTitle>
              <CardDescription className="text-xs">
                Prospective buyers requesting floor plans &amp; pricing
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs gap-1 h-8">
              <Link href="/admin/contact">
                <span>View all</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentLeads.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                No customer inquiries yet.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate">{lead.name}</span>
                        {!lead.is_read && (
                          <Badge variant="outline" className="text-[10px] py-0 text-emerald-700 bg-emerald-500/10 border-emerald-500/20">
                            New
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="h-3 w-3" /> {lead.phone}
                        </span>
                        {lead.configuration && (
                          <span className="font-medium text-foreground">
                            {lead.configuration}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Panel 2: Recently Updated Pages */}
        <Card className="border border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                Recent Pages
              </CardTitle>
              <CardDescription className="text-xs">
                Live website content and section structures
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs gap-1 h-8">
              <Link href="/admin/pages">
                <span>View all</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentPages.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                No pages created yet.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentPages.map((page) => (
                  <div key={page.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {page.is_homepage && (
                          <span title="Homepage">
                            <Globe className="h-3.5 w-3.5 text-primary shrink-0" />
                          </span>
                        )}
                        <span className="font-semibold text-sm truncate">{page.title}</span>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono mt-0.5">
                        /{page.slug}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant={page.status === 'published' ? 'default' : 'secondary'}
                        className={`text-[10px] capitalize ${
                          page.status === 'published' ? 'bg-emerald-600 hover:bg-emerald-600' : ''
                        }`}
                      >
                        {page.status}
                      </Badge>
                      <Button asChild variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Link href={`/admin/pages/${page.id}`}>
                          <Pencil className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ───────────────── FAST SHORTCUTS PANEL ───────────────── */}
      <div className="pt-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Quick Navigation Shortcuts
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <Link
            href="/admin/pages"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/40 transition-all text-center group"
          >
            <FileText className="h-5 w-5 text-primary group-hover:scale-110 transition-transform mb-1.5" />
            <span className="text-xs font-semibold">Pages</span>
            <span className="text-[10px] text-muted-foreground">{stats?.totalPages ?? 0} items</span>
          </Link>

          <Link
            href="/admin/open-links"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/40 transition-all text-center group"
          >
            <Link2 className="h-5 w-5 text-indigo-500 group-hover:scale-110 transition-transform mb-1.5" />
            <span className="text-xs font-semibold">Open Links</span>
            <span className="text-[10px] text-muted-foreground">{stats?.totalOpenLinks ?? 0} links</span>
          </Link>

          <Link
            href="/admin/forms"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/40 transition-all text-center group"
          >
            <FormInput className="h-5 w-5 text-amber-500 group-hover:scale-110 transition-transform mb-1.5" />
            <span className="text-xs font-semibold">Forms</span>
            <span className="text-[10px] text-muted-foreground">{stats?.totalForms ?? 0} forms</span>
          </Link>

          <Link
            href="/admin/nav"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/40 transition-all text-center group"
          >
            <Compass className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform mb-1.5" />
            <span className="text-xs font-semibold">Navbar</span>
            <span className="text-[10px] text-muted-foreground">{stats?.totalNavItems ?? 0} items</span>
          </Link>

          <Link
            href="/admin/footer"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/40 transition-all text-center group"
          >
            <Layers className="h-5 w-5 text-slate-500 group-hover:scale-110 transition-transform mb-1.5" />
            <span className="text-xs font-semibold">Footer</span>
            <span className="text-[10px] text-muted-foreground">Columns &amp; Links</span>
          </Link>

          <Link
            href="/admin/media"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/40 transition-all text-center group"
          >
            <ImageIcon className="h-5 w-5 text-purple-500 group-hover:scale-110 transition-transform mb-1.5" />
            <span className="text-xs font-semibold">Media</span>
            <span className="text-[10px] text-muted-foreground">{stats?.totalMedia ?? 0} files</span>
          </Link>

          <Link
            href="/admin/contact"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/40 transition-all text-center group"
          >
            <Mail className="h-5 w-5 text-emerald-500 group-hover:scale-110 transition-transform mb-1.5" />
            <span className="text-xs font-semibold">Inquiries</span>
            <span className="text-[10px] text-muted-foreground">{stats?.totalLeads ?? 0} leads</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Activity,
  FileText,
  Mail,
  Newspaper,
  Eye,
  TrendingUp,
  Star,
  MapPin,
  IndianRupee,
  Home,
  Calendar,
  TreePine,
  Building2,
  Compass,
  Award,
  ExternalLink,
  Settings,
  Sparkles,
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

interface Stats {
  pages: number;
  posts: number;
  messages: number;
  unread: number;
}

interface RecentItem {
  id: string;
  action: string;
  entity: string | null;
  details: string | null;
  admin_email: string | null;
  created_at: string;
}

interface ProjectInfo {
  project_title: string;
  project_category: string;
  project_subtitle: string;
  project_location: string;
  project_description: string;
  project_starting_price: string;
  project_configuration: string;
  project_possession: string;
  project_rera: string;
  project_developer: string;
  project_tagline: string;
  project_hero_image: string;
}

const DEFAULT_PROJECT_INFO: ProjectInfo = {
  project_title: 'Prestige Thane',
  project_category: 'PRE-LAUNCH LUXURY TOWNSHIP',
  project_subtitle: 'Luxury Living in the Heart of Thane',
  project_location: 'Balkum, Kapurbawadi, Thane West, Maharashtra',
  project_description:
    'Experience ultra-premium 2, 3 & 4 BHK residences set across 30+ acres of lush green landscapes. Thoughtfully designed homes with world-class amenities, exceptional connectivity, and the trust of Prestige Group.',
  project_starting_price: '₹1.59 Cr*',
  project_configuration: '2, 3 & 4 BHK',
  project_possession: 'Dec 2028',
  project_rera: 'MAHARERA: AWAITING RERA',
  project_developer: 'BY PRESTIGE GROUP',
  project_tagline: 'Live the Prestige Life',
  project_hero_image: '/assets/prestige-hero-bg.webp',
};

const PIE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];

/* ─── Prestige Eagle Emblem & Header Logo ─── */
function PrestigeShowcaseLogo() {
  return (
    <div className="flex items-center gap-3 select-none">
      <svg
        viewBox="0 0 100 65"
        className="w-10 h-8 text-[#C59137] shrink-0 drop-shadow-sm"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M50 8 C42 16, 28 20, 10 24 C18 29, 28 32, 38 33 C30 37, 20 42, 14 48 C24 47, 34 44, 42 40 C38 46, 32 54, 26 60 C36 56, 44 49, 49 41 C50 44, 50 48, 51 52 C53 47, 55 42, 55 37 C60 45, 68 53, 78 58 C72 52, 66 45, 62 39 C70 43, 80 46, 90 47 C84 41, 74 36, 66 32 C76 31, 86 28, 94 23 C76 19, 62 15, 54 7 Z" />
      </svg>
      <div className="flex flex-col leading-none">
        <span className="font-serif text-2xl font-bold tracking-tight text-slate-900">
          Prestige
        </span>
        <span className="text-[9px] font-bold tracking-[0.2em] text-[#C59137] uppercase mt-0.5">
          GROUP
        </span>
        <span className="text-[7.5px] text-slate-500 tracking-wider mt-0.5">
          Add Prestige to your life
        </span>
      </div>
    </div>
  );
}

export default function DashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentItem[]>([]);
  const [statusData, setStatusData] = useState<{ name: string; value: number }[]>([]);
  const [barData, setBarData] = useState<{ name: string; value: number }[]>([]);
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>(DEFAULT_PROJECT_INFO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    (async () => {
      // 1. Fetch project info from theme settings
      try {
        const themeRes = await fetch('/api/settings/theme', { cache: 'no-store' });
        if (themeRes.ok) {
          const themeJson = await themeRes.json();
          setProjectInfo({
            project_title: themeJson.project_title || DEFAULT_PROJECT_INFO.project_title,
            project_category: themeJson.project_category || DEFAULT_PROJECT_INFO.project_category,
            project_subtitle: themeJson.project_subtitle || DEFAULT_PROJECT_INFO.project_subtitle,
            project_location: themeJson.project_location || DEFAULT_PROJECT_INFO.project_location,
            project_description:
              themeJson.project_description || DEFAULT_PROJECT_INFO.project_description,
            project_starting_price:
              themeJson.project_starting_price || DEFAULT_PROJECT_INFO.project_starting_price,
            project_configuration:
              themeJson.project_configuration || DEFAULT_PROJECT_INFO.project_configuration,
            project_possession:
              themeJson.project_possession || DEFAULT_PROJECT_INFO.project_possession,
            project_rera: themeJson.project_rera || DEFAULT_PROJECT_INFO.project_rera,
            project_developer:
              themeJson.project_developer || DEFAULT_PROJECT_INFO.project_developer,
            project_tagline: themeJson.project_tagline || DEFAULT_PROJECT_INFO.project_tagline,
            project_hero_image:
              themeJson.project_hero_image || DEFAULT_PROJECT_INFO.project_hero_image,
          });
        }
      } catch (err) {
        console.warn('Could not load project info:', err);
      }

      // 2. Fetch Supabase stats
      const [p, bp, cs, logs] = await Promise.all([
        supabase.from('pages').select('id, status', { count: 'exact' }),
        supabase.from('blog_posts').select('id, status', { count: 'exact' }),
        supabase.from('contact_submissions').select('id, is_read', { count: 'exact' }),
        supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(8),
      ]);

      const pages = (p.data as { status: string }[]) ?? [];
      const posts = (bp.data as { status: string }[]) ?? [];
      const subs = (cs.data as { is_read: boolean }[]) ?? [];

      setStats({
        pages: pages.length,
        posts: posts.length,
        messages: subs.length,
        unread: subs.filter((s) => !s.is_read).length,
      });

      setStatusData([
        { name: 'Published pages', value: pages.filter((x) => x.status === 'published').length },
        { name: 'Draft pages', value: pages.filter((x) => x.status === 'draft').length },
        { name: 'Published posts', value: posts.filter((x) => x.status === 'published').length },
        { name: 'Draft posts', value: posts.filter((x) => x.status === 'draft').length },
      ]);

      setBarData([
        { name: 'Pages', value: pages.length },
        { name: 'Posts', value: posts.length },
        { name: 'Messages', value: subs.length },
      ]);

      setRecent((logs.data as RecentItem[]) ?? []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="text-muted-foreground p-8">Loading Prestige Admin Dashboard...</div>;

  const cards = [
    { label: 'Total Pages', value: stats?.pages ?? 0, icon: FileText, color: 'text-primary' },
    { label: 'Blog Posts', value: stats?.posts ?? 0, icon: Newspaper, color: 'text-success' },
    { label: 'Messages / Inquiries', value: stats?.messages ?? 0, icon: Mail, color: 'text-warning' },
    { label: 'Unread Leads', value: stats?.unread ?? 0, icon: Eye, color: 'text-destructive' },
  ];

  return (
    <div className="space-y-8">
      {/* ───────────────── PRESTIGE THANE SHOWCASE HERO BANNER ───────────────── */}
      <div className="relative rounded-3xl overflow-hidden border border-border shadow-xl bg-slate-950 text-slate-900">
        {/* Background Property Visual with Luxury Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
          style={{
            backgroundImage: `url('${projectInfo.project_hero_image || '/assets/prestige-hero-bg.webp'}')`,
          }}
        />
        {/* Gradients matching image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-white/95" />
        <div className="absolute inset-0 bg-amber-900/10 mix-blend-overlay" />

        {/* Content Container */}
        <div className="relative z-10 p-6 sm:p-8 xl:p-10 flex flex-col justify-between min-h-[380px]">
          {/* Top Row: Prestige Logo, RERA badge & Quick Action Links */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <PrestigeShowcaseLogo />
              {/* RERA Badge Pill */}
              <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-white/90 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-amber-900 shadow-sm">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span className="tracking-wide">{projectInfo.project_rera}</span>
                <span className="text-amber-300">|</span>
                <span className="text-slate-600">{projectInfo.project_developer}</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-all backdrop-blur-md border border-slate-200"
              >
                <ExternalLink className="h-3.5 w-3.5 text-slate-600" />
                <span>View Live Site</span>
              </Link>
              <Link
                href="/admin/settings"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#B87D28] to-[#C98B32] hover:opacity-90 text-white px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-all"
              >
                <Settings className="h-3.5 w-3.5" />
                <span>Edit Project Info</span>
              </Link>
            </div>
          </div>

          {/* Center: Prestige Project Info */}
          <div className="my-auto py-4 max-w-2xl">
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#B87D28] uppercase">
              {projectInfo.project_category}
            </span>
            <h2 className="mt-1.5 text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight text-slate-900 font-serif">
              {projectInfo.project_title}
            </h2>
            <p className="mt-1 text-lg sm:text-xl font-medium text-slate-800">
              {projectInfo.project_subtitle}
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-xs sm:text-sm text-slate-700">
              <MapPin className="h-4 w-4 text-[#C59137] shrink-0" />
              <span>{projectInfo.project_location}</span>
            </div>
            <p className="mt-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed max-w-xl">
              {projectInfo.project_description}
            </p>

            {/* 3 KPI Feature Cards (Starting Price, Configuration, Possession) */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl bg-white/95 backdrop-blur-md p-3.5 shadow-xl border border-white/60 max-w-xl">
              {/* Card 1: Starting Price */}
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-50 text-[#B87D28] border border-amber-200">
                  <IndianRupee className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                    Starting Price
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-slate-900">
                    {projectInfo.project_starting_price}
                  </span>
                </div>
              </div>

              {/* Card 2: Configuration */}
              <div className="flex items-center gap-2.5 sm:border-l border-slate-200/80 sm:pl-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-50 text-[#B87D28] border border-amber-200">
                  <Home className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                    Configuration
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-slate-900">
                    {projectInfo.project_configuration}
                  </span>
                </div>
              </div>

              {/* Card 3: Possession */}
              <div className="flex items-center gap-2.5 sm:border-l border-slate-200/80 sm:pl-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-50 text-[#B87D28] border border-amber-200">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                    Possession
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-slate-900">
                    {projectInfo.project_possession}
                  </span>
                </div>
              </div>
            </div>

            {/* 4 Feature Badges in a Row */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center max-w-xl">
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/70 backdrop-blur-sm">
                <TreePine className="h-4 w-4 text-[#B87D28]" />
                <span className="text-[10px] font-semibold text-slate-800">Green Landscapes</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/70 backdrop-blur-sm">
                <Building2 className="h-4 w-4 text-[#B87D28]" />
                <span className="text-[10px] font-semibold text-slate-800">World-Class Amenities</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/70 backdrop-blur-sm">
                <Compass className="h-4 w-4 text-[#B87D28]" />
                <span className="text-[10px] font-semibold text-slate-800">Excellent Connectivity</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/70 backdrop-blur-sm">
                <Award className="h-4 w-4 text-[#B87D28]" />
                <span className="text-[10px] font-semibold text-slate-800">Trusted Prestige Group</span>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="pt-2 flex items-center justify-between">
            <p className="font-serif italic text-amber-200/90 text-base sm:text-lg drop-shadow-md">
              {projectInfo.project_tagline}
            </p>
            <span className="text-[11px] text-slate-300">
              CMS Admin Workspace
            </span>
          </div>
        </div>
      </div>

      {/* ───────────────── CMS CONTENT OVERVIEW METRICS ───────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Content &amp; Lead Overview</h2>
          <p className="text-xs text-muted-foreground">Real-time statistics across pages, posts, and customer enquiries.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
                <Icon className={`h-5 w-5 ${c.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{c.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" /> Content counts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Publish status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={45}>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-4 w-4" /> Recent activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            <ul className="space-y-3">
              {recent.map((r) => (
                <li key={r.id} className="flex items-start gap-3 border-b border-border/60 pb-3 text-sm last:border-0 last:pb-0">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div>
                    <span className="font-medium">{r.action}</span>
                    {r.entity && <span className="text-muted-foreground"> on {r.entity}</span>}
                    {r.details && <span className="text-muted-foreground"> — {r.details}</span>}
                    <div className="text-xs text-muted-foreground/80">
                      {r.admin_email} · {new Date(r.created_at).toLocaleString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

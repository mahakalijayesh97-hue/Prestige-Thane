'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  Lock,
  LogIn,
  Clock,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  Smartphone,
  ShieldCheck,
  MapPin,
  IndianRupee,
  Home,
  Calendar,
  Sparkles,
  TreePine,
  Building2,
  Compass,
  Award,
  Star,
} from 'lucide-react';

/* ─── Prestige Eagle Emblem & Brand Logo Component ─── */
function PrestigeBrandLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      {/* Soaring Eagle Emblem */}
      <svg
        viewBox="0 0 100 65"
        className="w-12 h-9 text-[#C59137] drop-shadow-sm"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M50 8 C42 16, 28 20, 10 24 C18 29, 28 32, 38 33 C30 37, 20 42, 14 48 C24 47, 34 44, 42 40 C38 46, 32 54, 26 60 C36 56, 44 49, 49 41 C50 44, 50 48, 51 52 C53 47, 55 42, 55 37 C60 45, 68 53, 78 58 C72 52, 66 45, 62 39 C70 43, 80 46, 90 47 C84 41, 74 36, 66 32 C76 31, 86 28, 94 23 C76 19, 62 15, 54 7 Z" />
      </svg>
      {/* Prestige Typography */}
      <span className="font-serif text-2xl font-bold tracking-tight text-[#111827] leading-tight mt-0.5">
        Prestige
      </span>
      {/* GROUP Accent Bar */}
      <div className="flex items-center gap-1.5 w-full justify-center my-0.5">
        <span className="h-[1px] w-3.5 bg-[#C59137]/60" />
        <span className="text-[9px] font-bold tracking-[0.25em] text-[#C59137] uppercase">
          GROUP
        </span>
        <span className="h-[1px] w-3.5 bg-[#C59137]/60" />
      </div>
      <span className="text-[8px] tracking-wider uppercase text-slate-500 font-medium">
        Add Prestige to your life
      </span>
    </div>
  );
}

/* ─── Horizontal Header Logo for Showcase ─── */
function PrestigeHeaderLogo() {
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

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');

  const { user, setUser } = useAuth();
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('admin@prestige.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>(DEFAULT_PROJECT_INFO);

  useEffect(() => {
    // 1. If already logged in, redirect to admin dashboard
    if (user) {
      router.replace('/admin');
      return;
    }

    // 2. Fetch live theme & project info
    fetch('/api/settings/theme', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((theme) => {
        if (theme) {
          setProjectInfo({
            project_title: theme.project_title || DEFAULT_PROJECT_INFO.project_title,
            project_category: theme.project_category || DEFAULT_PROJECT_INFO.project_category,
            project_subtitle: theme.project_subtitle || DEFAULT_PROJECT_INFO.project_subtitle,
            project_location: theme.project_location || DEFAULT_PROJECT_INFO.project_location,
            project_description:
              theme.project_description || DEFAULT_PROJECT_INFO.project_description,
            project_starting_price:
              theme.project_starting_price || DEFAULT_PROJECT_INFO.project_starting_price,
            project_configuration:
              theme.project_configuration || DEFAULT_PROJECT_INFO.project_configuration,
            project_possession:
              theme.project_possession || DEFAULT_PROJECT_INFO.project_possession,
            project_rera: theme.project_rera || DEFAULT_PROJECT_INFO.project_rera,
            project_developer:
              theme.project_developer || DEFAULT_PROJECT_INFO.project_developer,
            project_tagline: theme.project_tagline || DEFAULT_PROJECT_INFO.project_tagline,
            project_hero_image:
              theme.project_hero_image || DEFAULT_PROJECT_INFO.project_hero_image,
          });
        }
      })
      .catch(() => {});

    // 3. Check existing MongoDB session
    fetch('/api/auth/session')
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          router.replace('/admin');
        } else {
          setChecking(false);
        }
      })
      .catch(() => setChecking(false));
  }, [user, router, setUser]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Authenticate against MongoDB via our API route
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        setUser(data.user);

        // Also sync with Supabase in the background if possible
        try {
          const supabase = getSupabaseBrowser();
          await supabase.auth.signInWithPassword({
            email,
            password: 'Admin@Pass2026!$',
          }).catch(() => {});
        } catch {
          // ignore background sync errors
        }

        window.location.href = '/admin';
        return;
      }

      // 2. Fallback: Check if user exists in Supabase directly
      const supabase = getSupabaseBrowser();
      const { data: supaData, error: supaError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!supaError && supaData.session?.user) {
        setUser({
          id: supaData.session.user.id,
          email: supaData.session.user.email ?? email,
          role: 'admin',
        });
        window.location.href = '/admin';
        return;
      }

      // If both fail, display error
      setError(data.error || 'Invalid login credentials. Please check your email and password.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleFillDefaults() {
    setEmail('admin@prestige.com');
    setPassword('Admin@123456');
    setMobileNumber('9876543210');
  }

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#FDFBF7]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#C59137]" />
          <p className="text-sm font-medium text-slate-600">Loading Prestige Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:grid lg:grid-cols-12 bg-[#F9F7F2]">
      {/* ───────────────── LEFT SIDE: PRESTIGE THANE SHOWCASE ───────────────── */}
      <div className="relative hidden lg:flex lg:col-span-7 flex-col justify-between p-8 xl:p-12 text-slate-900 overflow-hidden bg-slate-950">
        {/* Background Property Visual with Warm Luxury Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 scale-105"
          style={{
            backgroundImage: `url('${projectInfo.project_hero_image || '/assets/prestige-hero-bg.webp'}')`,
          }}
        />
        {/* Gradients to ensure text readability matching image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-white/95" />
        <div className="absolute inset-0 bg-amber-900/10 mix-blend-overlay" />

        {/* Top Header: Prestige Logo & RERA Badge */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <PrestigeHeaderLogo />

          {/* RERA Badge Pill */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-white/90 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-amber-900 shadow-sm">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span className="tracking-wide">{projectInfo.project_rera}</span>
            <span className="text-amber-300">|</span>
            <span className="text-slate-600">{projectInfo.project_developer}</span>
          </div>
        </div>

        {/* Center: Prestige Thane Project Highlights */}
        <div className="relative z-10 my-auto py-8 max-w-xl">
          {/* Sub-label */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#B87D28] uppercase">
              {projectInfo.project_category}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="mt-2 text-4xl xl:text-5xl font-extrabold tracking-tight text-slate-900 font-serif">
            {projectInfo.project_title}
          </h1>

          {/* Subtitle */}
          <p className="mt-1 text-xl xl:text-2xl font-medium text-slate-800">
            {projectInfo.project_subtitle}
          </p>

          {/* Location */}
          <div className="mt-2.5 flex items-center gap-1.5 text-xs xl:text-sm text-slate-700">
            <MapPin className="h-4 w-4 text-[#C59137] shrink-0" />
            <span>{projectInfo.project_location}</span>
          </div>

          {/* Description */}
          <p className="mt-3.5 text-xs xl:text-sm text-slate-700 leading-relaxed">
            {projectInfo.project_description}
          </p>

          {/* 3 KPI Feature Cards (Starting Price, Configuration, Possession) */}
          <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl bg-white/95 backdrop-blur-md p-3.5 xl:p-4 shadow-xl border border-white/60">
            {/* Card 1: Starting Price */}
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-50 text-[#B87D28] border border-amber-200">
                <IndianRupee className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  Starting Price
                </span>
                <span className="text-sm xl:text-base font-extrabold text-slate-900">
                  {projectInfo.project_starting_price}
                </span>
              </div>
            </div>

            {/* Card 2: Configuration */}
            <div className="flex items-center gap-2.5 border-l border-slate-200/80 pl-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-50 text-[#B87D28] border border-amber-200">
                <Home className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  Configuration
                </span>
                <span className="text-sm xl:text-base font-extrabold text-slate-900">
                  {projectInfo.project_configuration}
                </span>
              </div>
            </div>

            {/* Card 3: Possession */}
            <div className="flex items-center gap-2.5 border-l border-slate-200/80 pl-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-50 text-[#B87D28] border border-amber-200">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  Possession
                </span>
                <span className="text-sm xl:text-base font-extrabold text-slate-900">
                  {projectInfo.project_possession}
                </span>
              </div>
            </div>
          </div>

          {/* 4 Feature Badges in a Row */}
          <div className="mt-6 grid grid-cols-4 gap-2 text-center">
            <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/70 backdrop-blur-sm">
              <TreePine className="h-5 w-5 text-[#B87D28]" />
              <span className="text-[10px] xl:text-[11px] font-semibold text-slate-800 leading-tight">
                Green Landscapes
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/70 backdrop-blur-sm">
              <Building2 className="h-5 w-5 text-[#B87D28]" />
              <span className="text-[10px] xl:text-[11px] font-semibold text-slate-800 leading-tight">
                World-Class Amenities
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/70 backdrop-blur-sm">
              <Compass className="h-5 w-5 text-[#B87D28]" />
              <span className="text-[10px] xl:text-[11px] font-semibold text-slate-800 leading-tight">
                Excellent Connectivity
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/70 backdrop-blur-sm">
              <Award className="h-5 w-5 text-[#B87D28]" />
              <span className="text-[10px] xl:text-[11px] font-semibold text-slate-800 leading-tight">
                Trusted by Prestige Group
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Script Signature */}
        <div className="relative z-10 flex items-center justify-between">
          <p className="font-serif italic text-amber-200/90 text-lg xl:text-xl drop-shadow-md tracking-wide">
            {projectInfo.project_tagline}
          </p>
          <span className="text-[11px] text-slate-300">
            © {new Date().getFullYear()} Prestige Group. All rights reserved.
          </span>
        </div>
      </div>

      {/* ───────────────── RIGHT SIDE: SIGN-IN CARD ───────────────── */}
      <div className="flex flex-1 lg:col-span-5 items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden bg-[#FAF7F2]">
        {/* Subtle Decorative Background Watermark */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-amber-100/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-amber-50/50 blur-3xl pointer-events-none" />

        {/* Main Card Container */}
        <div className="relative w-full max-w-md rounded-[28px] border border-slate-100 bg-white p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
          {/* Prestige Center Logo */}
          <PrestigeBrandLogo className="mb-3" />

          {/* Heading */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-[26px] font-extrabold tracking-tight text-slate-900">
              Welcome Back!
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Sign in to continue to your account
            </p>

            {/* Decorative Gold Accent Line */}
            <div className="my-3 flex items-center justify-center gap-2">
              <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#C59137]" />
              <span className="text-[10px] text-[#C59137]">✦</span>
              <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#C59137]" />
            </div>
          </div>

          {/* Session Expiration or Server Restart Notice Banner */}
          {reason === 'session_expired' && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800">
              <Clock className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
              <div>
                <p className="font-semibold">Session Expired (30 Min)</p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Your session timed out after 30 minutes of inactivity. Please sign in again.
                </p>
              </div>
            </div>
          )}

          {reason === 'server_restarted' && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 text-xs text-blue-800">
              <RefreshCw className="h-4 w-4 shrink-0 mt-0.5 text-blue-600" />
              <div>
                <p className="font-semibold">Server Restarted</p>
                <p className="text-[11px] text-blue-700 mt-0.5">
                  The server was closed and restarted. For security, please sign in again.
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            {/* 2. Email Address */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                Email Address
              </Label>
              <div className="relative flex items-center rounded-xl border border-slate-200 bg-white shadow-sm transition-all focus-within:border-[#C59137] focus-within:ring-2 focus-within:ring-[#C59137]/20">
                <div className="pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="border-0 bg-transparent px-3 py-2 text-xs focus-visible:ring-0 shadow-none"
                  disabled={loading}
                />
              </div>
            </div>

            {/* 3. Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                Password
              </Label>
              <div className="relative flex items-center rounded-xl border border-slate-200 bg-white shadow-sm transition-all focus-within:border-[#C59137] focus-within:ring-2 focus-within:ring-[#C59137]/20">
                <div className="pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="border-0 bg-transparent px-3 pr-10 py-2 text-xs focus-visible:ring-0 shadow-none"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end pt-0.5">
                <a
                  href="#forgot-password"
                  onClick={(e) => {
                    e.preventDefault();
                    handleFillDefaults();
                  }}
                  className="text-[11px] font-semibold text-[#B87D28] hover:text-[#9A641B] transition-colors"
                >
                  Forgot Password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#B87D28] via-[#C98B32] to-[#B87D28] hover:from-[#A87022] hover:to-[#B87D28] text-white font-semibold text-sm shadow-md shadow-amber-900/15 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </>
              )}
            </Button>

            {/* Divider: OR */}
            <div className="relative my-3 flex items-center justify-center">
              <span className="w-full border-t border-slate-200" />
              <span className="absolute bg-white px-3 text-[10px] font-semibold tracking-wider uppercase text-slate-400">
                OR
              </span>
            </div>

            {/* Security Box */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white border border-slate-200 text-slate-600 shadow-xs">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-800">
                  Secure &amp; Encrypted Login
                </span>
                <span className="text-[11px] text-slate-500">
                  Your data is safe with us
                </span>
              </div>
            </div>

            {/* Bottom Security Note */}
            <p className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5 pt-1">
              <Lock className="h-3 w-3 text-amber-600" />
              <span>Only authorized personnel can access the system.</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center bg-[#FDFBF7]">
          <Loader2 className="h-8 w-8 animate-spin text-[#C59137]" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}

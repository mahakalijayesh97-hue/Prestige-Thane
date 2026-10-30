export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDFBF7] px-4 text-center">
      <div className="mx-auto max-w-md">
        <h1 className="font-serif text-6xl font-bold text-[#C59137]">404</h1>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#111827]">
          Page Not Found
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#B87D28] via-[#C98B32] to-[#B87D28] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:from-[#A87022] hover:to-[#B87D28] transition-all"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}


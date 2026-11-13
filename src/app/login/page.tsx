import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Activity, BarChart3, KeyRound, ShieldCheck, Stethoscope } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { Skeleton } from '@/components/ui/skeleton';
import { LoginForm } from '@/features/auth/login-form';

export const metadata: Metadata = { title: 'Sign in' };

const highlights = [
  {
    icon: Stethoscope,
    title: 'Doctor & patient records',
    text: 'One place for every care relationship.',
  },
  {
    icon: BarChart3,
    title: 'Live care analytics',
    text: 'Registrations, workload and case mix at a glance.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure by design',
    text: 'HttpOnly sessions, hashed credentials, rate limiting.',
  },
];

export default function LoginPage() {
  return (
    <main className="relative grid min-h-dvh overflow-hidden lg:grid-cols-[1.1fr_1fr]">
      <div className="app-backdrop" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/4 -z-10 size-[560px] -translate-x-1/2 rounded-full bg-teal-500/20 blur-[120px] dark:bg-teal-500/15"
      />

      {/* Brand */}
      <section className="hidden flex-col justify-between p-12 lg:flex">
        <Logo />
        <div className="page-enter max-w-xl space-y-9">
          <div className="space-y-5">
            <p className="border-primary/25 bg-accent text-accent-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
              <Activity className="size-3.5" /> Care Guide BD · Admin Console
            </p>
            <h1 className="text-[44px] leading-[1.08] font-semibold tracking-tight">
              Every doctor, every patient,
              <br />
              <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-sky-400 bg-clip-text text-transparent">
                one clear view.
              </span>
            </h1>
            <p className="text-muted-foreground max-w-md text-[15px] leading-relaxed">
              Manage your care network, track patient registrations and understand clinical workload
              — backed by real-time data.
            </p>
          </div>
          <ul className="stagger grid gap-3">
            {highlights.map(({ icon: Icon, title, text }) => (
              <li key={title} className="glass flex items-center gap-3.5 rounded-xl p-3.5">
                <span className="bg-accent ring-primary/20 grid size-9 shrink-0 place-items-center rounded-lg ring-1">
                  <Icon className="text-primary size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium">{title}</p>
                  <p className="text-muted-foreground text-[13px]">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-muted-foreground text-xs">Doctor Tracker · For authorised staff only.</p>
      </section>

      {/* Form */}
      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="glass page-enter w-full max-w-[400px] space-y-7 rounded-3xl p-7 sm:p-9">
          <div className="space-y-5">
            <Logo className="lg:hidden" />
            <span className="bg-accent ring-primary/20 grid size-11 place-items-center rounded-xl ring-1">
              <KeyRound className="text-primary size-5" aria-hidden="true" />
            </span>
            <div className="space-y-1.5">
              <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
              <p className="text-muted-foreground text-sm">
                Sign in with your administrator credentials.
              </p>
            </div>
          </div>

          <Suspense fallback={<LoginFormSkeleton />}>
            <LoginForm />
          </Suspense>

          <div className="bg-muted/60 rounded-xl border border-dashed p-3.5 text-sm">
            <p className="text-xs font-medium tracking-wide uppercase">Demo access</p>
            <p className="text-muted-foreground mt-1 font-mono text-[12.5px]">
              admin@doctortracker.app
              <br />
              CareGuide@2026
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function LoginFormSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-16" />
      <Skeleton className="h-16" />
      <Skeleton className="h-10" />
    </div>
  );
}

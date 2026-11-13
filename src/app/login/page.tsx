import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Activity, BarChart3, ShieldCheck, Stethoscope } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { Skeleton } from '@/components/ui/skeleton';
import { LoginForm } from '@/features/auth/login-form';

export const metadata: Metadata = { title: 'Sign in' };

const highlights = [
  { icon: Stethoscope, title: 'Doctor & patient records', text: 'One place for every care relationship.' },
  { icon: BarChart3, title: 'Live care analytics', text: 'Registrations, workload and case mix at a glance.' },
  { icon: ShieldCheck, title: 'Secure by design', text: 'HttpOnly sessions, hashed credentials, rate limiting.' },
];

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <section className="bg-sidebar text-sidebar-foreground relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:44px_44px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -bottom-40 size-[520px] rounded-full bg-teal-500/15 blur-3xl"
        />
        <Logo className="relative text-white" />

        <div className="relative max-w-md space-y-8">
          <div className="space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-teal-300 ring-1 ring-white/10">
              <Activity className="size-3.5" /> Care Guide BD · Admin Console
            </p>
            <h1 className="text-4xl leading-[1.15] font-semibold tracking-tight text-white">
              Every doctor, every patient,
              <br />
              <span className="text-teal-300">one clear view.</span>
            </h1>
            <p className="text-sidebar-foreground/80 text-[15px] leading-relaxed">
              Manage your care network, track patient registrations and understand clinical workload —
              backed by real-time data.
            </p>
          </div>

          <ul className="space-y-4">
            {highlights.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <Icon className="size-4 text-teal-300" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{title}</p>
                  <p className="text-sidebar-foreground/70 text-sm">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sidebar-foreground/50 relative text-xs">
          Doctor Tracker · For authorised staff only.
        </p>
      </section>

      {/* Form panel */}
      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-sm space-y-8">
          <Logo className="lg:hidden" />
          <div className="space-y-1.5">
            <h2 className="text-2xl font-semibold tracking-tight">Sign in to your account</h2>
            <p className="text-muted-foreground text-sm">Enter your administrator credentials to continue.</p>
          </div>

          <Suspense fallback={<LoginFormSkeleton />}>
            <LoginForm />
          </Suspense>

          <div className="bg-muted/60 rounded-lg border border-dashed p-3.5 text-sm">
            <p className="font-medium">Demo access</p>
            <p className="text-muted-foreground mt-0.5">
              <span className="text-foreground font-mono text-[13px]">admin@doctortracker.app</span>
              {' · '}
              <span className="text-foreground font-mono text-[13px]">CareGuide@2026</span>
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

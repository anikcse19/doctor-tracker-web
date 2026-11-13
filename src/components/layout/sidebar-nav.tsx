'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from './nav-items';

type Props = { onNavigate?: () => void };

/**
 * The links prerender into the static shell with no active state; the pathname-dependent
 * highlight streams in (Cache Components requires URL reads to sit behind Suspense).
 */
export function SidebarNav(props: Props) {
  return (
    <Suspense fallback={<NavLinks {...props} pathname={null} />}>
      <ActiveSidebarNav {...props} />
    </Suspense>
  );
}

function ActiveSidebarNav(props: Props) {
  return <NavLinks {...props} pathname={usePathname()} />;
}

function NavLinks({ onNavigate, pathname }: Props & { pathname: string | null }) {
  return (
    <nav aria-label="Main" className="space-y-0.5">
      <p className="text-muted-foreground/70 px-3 pb-2 text-[10.5px] font-semibold tracking-[0.12em] uppercase">
        Workspace
      </p>
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = !!pathname && (pathname === href || pathname.startsWith(`${href}/`));
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'group focus-visible:ring-ring/60 relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-all outline-none focus-visible:ring-2',
              active
                ? 'text-foreground bg-gradient-to-r from-teal-500/15 to-transparent dark:from-teal-400/15'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            )}
          >
            {active && (
              <span
                aria-hidden="true"
                className="bg-primary absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-r-full shadow-[0_0_12px_1px] shadow-teal-400/70"
              />
            )}
            <Icon
              className={cn(
                'size-[18px] transition-colors',
                active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
              )}
              aria-hidden="true"
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

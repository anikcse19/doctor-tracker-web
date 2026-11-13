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
    <nav aria-label="Main" className="space-y-1">
      <p className="text-sidebar-foreground/45 px-3 pb-2 text-[11px] font-medium tracking-[0.08em] uppercase">
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
              'group focus-visible:ring-sidebar-ring relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2',
              active
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
            )}
          >
            {active && (
              <span
                aria-hidden="true"
                className="bg-sidebar-primary absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-r-full"
              />
            )}
            <Icon className={cn('size-[18px]', active ? 'text-sidebar-primary' : 'opacity-80')} aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

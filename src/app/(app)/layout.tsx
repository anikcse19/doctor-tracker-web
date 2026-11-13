import Link from 'next/link';
import { Logo } from '@/components/shared/logo';
import { CommandMenu } from '@/components/layout/command-menu';
import { MobileNav } from '@/components/layout/mobile-nav';
import { SearchTrigger } from '@/components/layout/search-trigger';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { UserMenu } from '@/components/layout/user-menu';

/**
 * Authenticated app shell: ambient glow backdrop, floating glass sidebar, content canvas.
 * It reads no request data itself, so it is prerendered into the static shell and appears
 * instantly; page content and the user menu stream in.
 */
export default function AppLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[272px_1fr]">
      <div className="app-backdrop" aria-hidden="true" />
      <a
        href="#main"
        className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      <aside className="hidden lg:block">
        <div className="glass sticky top-3 m-3 mr-0 flex h-[calc(100dvh-1.5rem)] flex-col rounded-2xl">
          <div className="flex h-16 items-center px-5">
            <Link href="/dashboard" className="rounded-md">
              <Logo />
            </Link>
          </div>
          <div className="px-3">
            <SearchTrigger className="w-full" />
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-5">
            <SidebarNav />
          </div>
          <div className="space-y-2 border-t p-3">
            <ThemeToggle className="w-full" />
            <UserMenu />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="glass sticky top-0 z-30 flex h-14 items-center gap-2 rounded-none border-x-0 border-t-0 px-3 lg:hidden">
          <MobileNav />
          <Link href="/dashboard" className="flex-1">
            <Logo />
          </Link>
          <SearchTrigger compact />
        </header>
        <main
          id="main"
          className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
        >
          {children}
        </main>
      </div>

      <CommandMenu />
    </div>
  );
}

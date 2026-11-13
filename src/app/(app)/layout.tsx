import Link from 'next/link';
import { Logo } from '@/components/shared/logo';
import { MobileNav } from '@/components/layout/mobile-nav';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { UserMenu } from '@/components/layout/user-menu';

/**
 * Authenticated app shell. It reads no request data itself, so it is prerendered into the
 * static shell and appears instantly; page content and the user menu stream in.
 */
export default function AppLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[256px_1fr]">
      <a
        href="#main"
        className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      {/* Outer aside fills the full column height; inner panel stays pinned while content scrolls. */}
      <aside className="bg-sidebar text-sidebar-foreground hidden lg:block">
        <div className="sticky top-0 flex h-dvh flex-col">
          <div className="flex h-16 items-center px-5">
            <Link href="/dashboard" className="rounded-md text-white">
              <Logo />
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <SidebarNav />
          </div>
          <div className="border-sidebar-border border-t p-3">
            <UserMenu />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="bg-background/80 sticky top-0 z-30 flex h-14 items-center gap-2 border-b px-4 backdrop-blur lg:hidden">
          <MobileNav />
          <Link href="/dashboard">
            <Logo />
          </Link>
        </header>
        <main
          id="main"
          className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

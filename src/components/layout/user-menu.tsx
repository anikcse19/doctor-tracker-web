'use client';

import { ChevronsUpDown, LogOut, ShieldCheck } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentAdmin, useLogout } from '@/features/auth/hooks';
import { initials } from '@/lib/format';

export function UserMenu() {
  const { data: admin, isPending } = useCurrentAdmin();
  const logout = useLogout();

  if (isPending || !admin) {
    return (
      <div className="flex items-center gap-3 p-2">
        <Skeleton className="size-9 rounded-full" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-sidebar-accent focus-visible:ring-ring/60 flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors outline-none focus-visible:ring-2">
        <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-teal-400 to-indigo-500 text-xs font-semibold text-white ring-2 ring-white/10">
          {initials(admin.name)}
          <span className="ring-background absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full bg-emerald-400 ring-2" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="text-foreground block truncate text-sm font-medium">{admin.name}</span>
          <span className="text-muted-foreground block truncate text-xs">{admin.email}</span>
        </span>
        <ChevronsUpDown className="text-muted-foreground size-4" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium">{admin.name}</p>
          <p className="text-muted-foreground flex items-center gap-1 text-xs">
            <ShieldCheck className="size-3" /> Administrator
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => logout.mutate()}
          disabled={logout.isPending}
          variant="destructive"
        >
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

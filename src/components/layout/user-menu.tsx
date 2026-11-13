'use client';

import { ChevronsUpDown, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
        <Skeleton className="bg-sidebar-accent size-9 rounded-full" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="bg-sidebar-accent h-3 w-24" />
          <Skeleton className="bg-sidebar-accent h-3 w-32" />
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-sidebar-accent focus-visible:ring-sidebar-ring flex w-full items-center gap-3 rounded-lg p-2 text-left outline-none focus-visible:ring-2">
        <Avatar className="size-9">
          <AvatarFallback className="bg-teal-500/20 text-xs font-semibold text-teal-200">
            {initials(admin.name)}
          </AvatarFallback>
        </Avatar>
        <span className="min-w-0 flex-1">
          <span className="text-sidebar-accent-foreground block truncate text-sm font-medium">
            {admin.name}
          </span>
          <span className="text-sidebar-foreground/60 block truncate text-xs">{admin.email}</span>
        </span>
        <ChevronsUpDown className="text-sidebar-foreground/50 size-4" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium">{admin.name}</p>
          <p className="text-muted-foreground text-xs">Administrator</p>
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

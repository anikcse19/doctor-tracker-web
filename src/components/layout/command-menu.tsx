'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from 'next-themes';
import {
  LayoutDashboard,
  Loader2,
  LogOut,
  Monitor,
  Moon,
  Plus,
  Stethoscope,
  Sun,
  User,
  Users,
} from 'lucide-react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useLogout } from '@/features/auth/hooks';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { api } from '@/lib/api/client';
import type { DoctorListItem, Patient } from '@/lib/api/types';

const OPEN_EVENT = 'doctor-tracker:open-command-menu';

/** Opens the command menu from anywhere (e.g. the sidebar search button). */
export function openCommandMenu() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

/**
 * ⌘K / Ctrl+K command palette: navigation, actions, theme, and live search across doctors
 * and patients (server-side search via the same API endpoints, 5 results each).
 */
export function CommandMenu() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const logout = useLogout();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const term = useDebouncedValue(search.trim(), 250);
  const searching = term.length >= 2;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  const results = useQuery({
    queryKey: ['command-search', term],
    enabled: open && searching,
    queryFn: async ({ signal }) => {
      const query = { search: term, limit: 5 };
      const [doctors, patients] = await Promise.all([
        api.getPaginated<DoctorListItem>('/doctors', query, signal),
        api.getPaginated<Patient>('/patients', query, signal),
      ]);
      return { doctors: doctors.items, patients: patients.items };
    },
    staleTime: 60_000,
  });

  const run = (action: () => void) => {
    setOpen(false);
    setSearch('');
    action();
  };

  // Static items are filtered locally; server results are already filtered by the API.
  const matches = (label: string) =>
    !search || label.toLowerCase().includes(search.trim().toLowerCase());

  const pages = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Doctors', icon: Stethoscope, href: '/doctors' },
    { label: 'Patients', icon: Users, href: '/patients' },
  ].filter((item) => matches(item.label));

  const actions = [
    { label: 'Add a new doctor', icon: Plus, run: () => router.push('/doctors?new=true') },
    { label: 'Switch to dark theme', icon: Moon, run: () => setTheme('dark') },
    { label: 'Switch to light theme', icon: Sun, run: () => setTheme('light') },
    { label: 'Use system theme', icon: Monitor, run: () => setTheme('system') },
    { label: 'Sign out', icon: LogOut, run: () => logout.mutate() },
  ].filter((item) => matches(item.label));

  const doctors = searching ? (results.data?.doctors ?? []) : [];
  const patients = searching ? (results.data?.patients ?? []) : [];
  const nothing = pages.length + actions.length + doctors.length + patients.length === 0;

  return (
    <CommandDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setSearch('');
      }}
      title="Command menu"
      description="Search doctors and patients, or jump to a page"
      className="sm:max-w-xl"
    >
      <Command shouldFilter={false} className="bg-transparent">
        <CommandInput
          value={search}
          onValueChange={setSearch}
          placeholder="Search doctors, patients, or type a command…"
        />
        <CommandList className="max-h-[420px]">
          {searching && results.isFetching && (
            <div className="text-muted-foreground flex items-center gap-2 px-3 py-2 text-xs">
              <Loader2 className="size-3.5 animate-spin" /> Searching records…
            </div>
          )}
          {nothing && !results.isFetching && (
            <CommandEmpty>No results for “{search}”.</CommandEmpty>
          )}

          {doctors.length > 0 && (
            <CommandGroup heading="Doctors">
              {doctors.map((doctor) => (
                <CommandItem
                  key={doctor._id}
                  value={`doctor-${doctor._id}`}
                  onSelect={() => run(() => router.push(`/doctors/${doctor._id}`))}
                >
                  <Stethoscope />
                  <span className="truncate">{doctor.name}</span>
                  <span className="text-muted-foreground ml-auto truncate text-xs">
                    {doctor.specialization}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {patients.length > 0 && (
            <CommandGroup heading="Patients">
              {patients.map((patient) => (
                <CommandItem
                  key={patient._id}
                  value={`patient-${patient._id}`}
                  onSelect={() => run(() => router.push(`/patients/${patient._id}`))}
                >
                  <User />
                  <span className="truncate">{patient.name}</span>
                  <span className="text-muted-foreground ml-auto truncate text-xs">
                    {patient.condition}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {(doctors.length > 0 || patients.length > 0) && <CommandSeparator />}

          {pages.length > 0 && (
            <CommandGroup heading="Go to">
              {pages.map((page) => (
                <CommandItem
                  key={page.href}
                  value={page.href}
                  onSelect={() => run(() => router.push(page.href))}
                >
                  <page.icon />
                  {page.label}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {actions.length > 0 && (
            <CommandGroup heading="Actions">
              {actions.map((action) => (
                <CommandItem
                  key={action.label}
                  value={action.label}
                  onSelect={() => run(action.run)}
                >
                  <action.icon />
                  {action.label}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
        <div className="text-muted-foreground flex items-center justify-between border-t px-3 py-2 text-[11px]">
          <span>Type at least 2 characters to search records</span>
          <span className="flex items-center gap-1">
            <kbd className="bg-muted rounded px-1.5 py-0.5 font-mono">↵</kbd> select
            <kbd className="bg-muted ml-2 rounded px-1.5 py-0.5 font-mono">esc</kbd> close
          </span>
        </div>
      </Command>
    </CommandDialog>
  );
}

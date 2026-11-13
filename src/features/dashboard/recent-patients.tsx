import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ConditionTag, InitialsAvatar } from '@/components/shared/badges';
import { GENDER_LABELS } from '@/lib/constants';
import type { DashboardStats } from '@/lib/api/types';
import { ageFromDob, formatRelative } from '@/lib/format';
import { ChartEmpty } from './chart-card';

export function RecentPatients({ patients }: { patients: DashboardStats['recentPatients'] }) {
  if (patients.length === 0) return <ChartEmpty message="No patients registered yet" />;

  return (
    <ul className="-mx-2 divide-y">
      {patients.map((patient) => (
        <li key={patient._id}>
          <Link
            href={`/patients/${patient._id}`}
            className="hover:bg-muted/50 flex items-center gap-3 rounded-lg px-2 py-2.5"
          >
            <InitialsAvatar name={patient.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{patient.name}</p>
              <p className="text-muted-foreground truncate text-xs">
                {ageFromDob(patient.dateOfBirth)} yrs · {GENDER_LABELS[patient.gender]} · {patient.doctor.name}
              </p>
            </div>
            <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
              <ConditionTag condition={patient.condition} />
              <span className="text-muted-foreground text-xs">{formatRelative(patient.createdAt)}</span>
            </div>
            <ChevronRight className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

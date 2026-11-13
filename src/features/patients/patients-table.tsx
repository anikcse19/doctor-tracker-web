'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ConditionTag, InitialsAvatar } from '@/components/shared/badges';
import { GENDER_LABELS } from '@/lib/constants';
import type { Patient } from '@/lib/api/types';
import { ageFromDob, formatDate, formatPhone } from '@/lib/format';

interface Props {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
  /** Hide the doctor column when the table is already scoped to one doctor. */
  showDoctor?: boolean;
}

export function PatientsTable({ patients, onEdit, onDelete, showDoctor = true }: Props) {
  const router = useRouter();

  return (
    <>
      <Table className="hidden md:table">
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="pl-4">Patient</TableHead>
            <TableHead>Age / Gender</TableHead>
            <TableHead>Condition</TableHead>
            {showDoctor && <TableHead className="hidden lg:table-cell">Doctor</TableHead>}
            <TableHead className="hidden xl:table-cell">Phone</TableHead>
            <TableHead className="hidden lg:table-cell">Registered</TableHead>
            <TableHead className="w-12"><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow
              key={patient._id}
              className="cursor-pointer"
              onClick={() => router.push(`/patients/${patient._id}`)}
            >
              <TableCell className="pl-4">
                <div className="flex items-center gap-3">
                  <InitialsAvatar name={patient.name} />
                  <div className="min-w-0">
                    <Link
                      href={`/patients/${patient._id}`}
                      onClick={(event) => event.stopPropagation()}
                      className="block truncate font-medium hover:underline"
                    >
                      {patient.name}
                    </Link>
                    <p className="text-muted-foreground truncate text-xs">{patient.email ?? 'No email'}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="tabular whitespace-nowrap">
                {ageFromDob(patient.dateOfBirth)} yrs
                <span className="text-muted-foreground"> · {GENDER_LABELS[patient.gender]}</span>
              </TableCell>
              <TableCell className="max-w-48"><ConditionTag condition={patient.condition} /></TableCell>
              {showDoctor && (
                <TableCell className="hidden lg:table-cell">
                  <Link
                    href={`/doctors/${patient.doctor._id}`}
                    onClick={(event) => event.stopPropagation()}
                    className="block max-w-52 truncate text-sm hover:underline"
                  >
                    {patient.doctor.name}
                  </Link>
                  <p className="text-muted-foreground truncate text-xs">{patient.doctor.specialization}</p>
                </TableCell>
              )}
              <TableCell className="text-muted-foreground tabular hidden xl:table-cell">
                {formatPhone(patient.phone)}
              </TableCell>
              <TableCell className="text-muted-foreground hidden lg:table-cell">
                {formatDate(patient.createdAt)}
              </TableCell>
              <TableCell onClick={(event) => event.stopPropagation()}>
                <RowActions patient={patient} onEdit={onEdit} onDelete={onDelete} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ul className="divide-y md:hidden">
        {patients.map((patient) => (
          <li key={patient._id} className="flex items-center gap-3 px-4 py-3.5">
            <InitialsAvatar name={patient.name} />
            <Link href={`/patients/${patient._id}`} className="min-w-0 flex-1 space-y-1">
              <p className="truncate font-medium">{patient.name}</p>
              <p className="text-muted-foreground truncate text-xs">
                {ageFromDob(patient.dateOfBirth)} yrs · {GENDER_LABELS[patient.gender]}
                {showDoctor && ` · ${patient.doctor.name}`}
              </p>
              <ConditionTag condition={patient.condition} />
            </Link>
            <RowActions patient={patient} onEdit={onEdit} onDelete={onDelete} />
          </li>
        ))}
      </ul>
    </>
  );
}

function RowActions({
  patient,
  onEdit,
  onDelete,
}: {
  patient: Patient;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${patient.name}`}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem asChild>
          <Link href={`/patients/${patient._id}`}>
            <Eye /> View details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onEdit(patient)}>
          <Pencil /> Edit patient
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => onDelete(patient)}>
          <Trash2 /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

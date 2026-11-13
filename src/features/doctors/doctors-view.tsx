'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Plus, SearchX, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PageHeader } from '@/components/shared/page-header';
import { ListCard, ListToolbar, TableSkeleton } from '@/components/shared/list-card';
import { SearchInput } from '@/components/shared/search-input';
import {
  DateRangeChip,
  FacetedFilter,
  ResetFiltersButton,
  SortMenu,
} from '@/components/shared/filters';
import { Pagination } from '@/components/shared/pagination';
import { EmptyState, ErrorState } from '@/components/shared/states';
import { InitialsAvatar, Tag } from '@/components/shared/badges';
import { SPECIALIZATIONS } from '@/lib/constants';
import { formatDate, formatNumber, formatPhone } from '@/lib/format';
import type { DoctorListItem } from '@/lib/api/types';
import { useDoctors, useHospitals } from './api';
import { DoctorFormDialog } from './doctor-form-dialog';
import { useDoctorListParams } from './use-doctor-list-params';

const specializationOptions = SPECIALIZATIONS.map((value) => ({ value, label: value }));

export function DoctorsView() {
  const router = useRouter();
  const { params, apiQuery, setParams, setFilter, reset, activeFilterCount } =
    useDoctorListParams();
  const { data, isPending, isError, error, refetch, isFetching, isPlaceholderData } =
    useDoctors(apiQuery);
  const { data: hospitals = [] } = useHospitals();
  const createOpen = params.new;
  const setCreateOpen = (open: boolean) => setParams({ new: open || null });

  const doctors = data?.items ?? [];

  return (
    <>
      <PageHeader
        title="Doctors"
        description={
          data
            ? `${formatNumber(data.meta.total)} doctors in your care network`
            : 'Your care network'
        }
        actions={
          <Button
            onClick={() => setCreateOpen(true)}
            className="shadow-[0_0_24px_-6px] shadow-teal-400/60"
          >
            <Plus /> Add doctor
          </Button>
        }
      />

      <ListCard
        isFetching={isFetching && (isPlaceholderData || !isPending)}
        toolbar={
          <ListToolbar
            search={
              <SearchInput
                value={params.search}
                onChange={(search) => setFilter({ search })}
                placeholder="Search name, email, phone, hospital…"
              />
            }
            filters={
              <>
                <FacetedFilter
                  title="Specialty"
                  options={specializationOptions}
                  selected={params.specialization}
                  onChange={(value) =>
                    setFilter({ specialization: value as typeof params.specialization })
                  }
                />
                <FacetedFilter
                  title="Hospital"
                  options={hospitals.map((value) => ({ value, label: value }))}
                  selected={params.hospital}
                  onChange={(hospital) => setFilter({ hospital })}
                />
                <DateRangeChip
                  title="Joined"
                  from={params.from}
                  to={params.to}
                  onChange={(range) => setFilter(range)}
                />
                <ResetFiltersButton count={activeFilterCount} onReset={reset} />
              </>
            }
            end={<SortMenu value={params.sort} onChange={(sort) => setParams({ sort, page: 1 })} />}
          />
        }
      >
        {isPending ? (
          <TableSkeleton />
        ) : isError ? (
          <ErrorState error={error} onRetry={() => refetch()} />
        ) : doctors.length === 0 ? (
          activeFilterCount > 0 ? (
            <EmptyState
              icon={SearchX}
              title="No doctors match your filters"
              description="Try a different search term or remove some filters."
              action={
                <Button variant="outline" onClick={reset}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={Stethoscope}
              title="No doctors yet"
              description="Add your first doctor to start assigning patients."
              action={
                <Button onClick={() => setCreateOpen(true)}>
                  <Plus /> Add doctor
                </Button>
              }
            />
          )
        ) : (
          <>
            <Table className="hidden md:table">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4">Doctor</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead className="hidden xl:table-cell">Hospital</TableHead>
                  <TableHead className="hidden lg:table-cell">Phone</TableHead>
                  <TableHead className="text-right">Patients</TableHead>
                  <TableHead className="hidden lg:table-cell">Joined</TableHead>
                  <TableHead className="w-10">
                    <span className="sr-only">Open</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.map((doctor) => (
                  <TableRow
                    key={doctor._id}
                    className="group cursor-pointer"
                    onClick={() => router.push(`/doctors/${doctor._id}`)}
                  >
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-3">
                        <InitialsAvatar name={doctor.name} />
                        <div className="min-w-0">
                          <Link
                            href={`/doctors/${doctor._id}`}
                            onClick={(event) => event.stopPropagation()}
                            className="group-hover:text-primary block truncate font-medium transition-colors"
                          >
                            {doctor.name}
                          </Link>
                          <p className="text-muted-foreground truncate text-xs">{doctor.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Tag>{doctor.specialization}</Tag>
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden max-w-56 truncate xl:table-cell">
                      {doctor.hospital}
                    </TableCell>
                    <TableCell className="text-muted-foreground tabular hidden lg:table-cell">
                      {formatPhone(doctor.phone)}
                    </TableCell>
                    <TableCell className="text-right">
                      <PatientLoad count={doctor.patientCount} />
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden lg:table-cell">
                      {formatDate(doctor.createdAt)}
                    </TableCell>
                    <TableCell>
                      <ArrowUpRight className="text-muted-foreground size-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <ul className="divide-y md:hidden">
              {doctors.map((doctor) => (
                <li key={doctor._id}>
                  <DoctorCard doctor={doctor} />
                </li>
              ))}
            </ul>

            {data && (
              <Pagination
                meta={data.meta}
                isFetching={isFetching}
                onPageChange={(page) => setParams({ page })}
                onLimitChange={(limit) => setParams({ limit, page: 1 })}
              />
            )}
          </>
        )}
      </ListCard>

      <DoctorFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(doctor) => router.push(`/doctors/${doctor._id}`)}
      />
    </>
  );
}

/** Patient count with a tiny load bar (relative to a 40-patient reference caseload). */
function PatientLoad({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center justify-end gap-2.5">
      <span
        aria-hidden="true"
        className="bg-muted hidden h-1.5 w-14 overflow-hidden rounded-full lg:block"
      >
        <span
          className="block h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-300"
          style={{ width: `${Math.min(100, (count / 40) * 100)}%` }}
        />
      </span>
      <span className="tabular w-6 text-right font-semibold">{count}</span>
      <span className="sr-only">patients</span>
    </span>
  );
}

function DoctorCard({ doctor }: { doctor: DoctorListItem }) {
  return (
    <Link
      href={`/doctors/${doctor._id}`}
      className="hover:bg-muted/50 flex items-center gap-3 px-4 py-3.5 transition-colors"
    >
      <InitialsAvatar name={doctor.name} />
      <div className="min-w-0 flex-1 space-y-1">
        <p className="truncate font-medium">{doctor.name}</p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Tag>{doctor.specialization}</Tag>
          <span className="text-muted-foreground truncate text-xs">{doctor.hospital}</span>
        </div>
      </div>
      <PatientLoad count={doctor.patientCount} />
    </Link>
  );
}

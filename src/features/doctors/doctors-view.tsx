'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Plus, SearchX, Stethoscope, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageHeader } from '@/components/shared/page-header';
import { ActiveFilters, ListCard, TableSkeleton } from '@/components/shared/list-card';
import { SearchInput } from '@/components/shared/search-input';
import { FilterSelect } from '@/components/shared/filter-select';
import { DateRangeFilter } from '@/components/shared/date-range-filter';
import { Pagination } from '@/components/shared/pagination';
import { EmptyState, ErrorState } from '@/components/shared/states';
import { InitialsAvatar, Tag } from '@/components/shared/badges';
import { SORT_OPTIONS, SPECIALIZATIONS } from '@/lib/constants';
import { formatDate, formatNumber, formatPhone } from '@/lib/format';
import type { DoctorListItem } from '@/lib/api/types';
import { useDoctors, useHospitals } from './api';
import { DoctorFormDialog } from './doctor-form-dialog';
import { useDoctorListParams } from './use-doctor-list-params';

const specializationOptions = SPECIALIZATIONS.map((value) => ({ value, label: value }));

export function DoctorsView() {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const { params, apiQuery, setParams, setFilter, reset, activeFilterCount } = useDoctorListParams();
  const { data, isPending, isError, error, refetch, isFetching, isPlaceholderData } = useDoctors(apiQuery);
  const { data: hospitals = [] } = useHospitals();

  const doctors = data?.items ?? [];

  return (
    <>
      <PageHeader
        title="Doctors"
        description={
          data ? `${formatNumber(data.meta.total)} doctors in your care network` : 'Your care network'
        }
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus /> Add doctor
          </Button>
        }
      />

      <ListCard
        isFetching={isFetching && (isPlaceholderData || !isPending)}
        toolbar={
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <SearchInput
              value={params.search}
              onChange={(search) => setFilter({ search })}
              placeholder="Search name, email, phone or hospital…"
              className="lg:max-w-xs lg:flex-1"
            />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:flex-1 lg:justify-end">
              <FilterSelect
                label="Filter by specialization"
                allLabel="All specializations"
                value={params.specialization}
                options={specializationOptions}
                onChange={(value) => setFilter({ specialization: value as typeof params.specialization })}
                className="lg:w-48"
              />
              <FilterSelect
                label="Filter by hospital"
                allLabel="All hospitals"
                value={params.hospital}
                options={hospitals.map((value) => ({ value, label: value }))}
                onChange={(hospital) => setFilter({ hospital })}
                className="lg:w-48"
              />
              <div className="lg:w-48">
                <DateRangeFilter
                  from={params.from}
                  to={params.to}
                  onChange={(range) => setFilter(range)}
                  label="Joined"
                />
              </div>
              <FilterSelect
                label="Sort doctors"
                allLabel="Newest first"
                value={params.sort === 'newest' ? null : params.sort}
                options={SORT_OPTIONS.filter((option) => option.value !== 'newest')}
                onChange={(value) => setParams({ sort: (value ?? 'newest') as typeof params.sort, page: 1 })}
                className="lg:w-40"
              />
            </div>
            <ActiveFilters count={activeFilterCount} onReset={reset} />
          </div>
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
              action={<Button variant="outline" onClick={reset}>Clear filters</Button>}
            />
          ) : (
            <EmptyState
              icon={Stethoscope}
              title="No doctors yet"
              description="Add your first doctor to start assigning patients."
              action={<Button onClick={() => setCreateOpen(true)}><Plus /> Add doctor</Button>}
            />
          )
        ) : (
          <>
            {/* Desktop / tablet table */}
            <Table className="hidden md:table">
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="pl-4">Doctor</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead className="hidden xl:table-cell">Hospital</TableHead>
                  <TableHead className="hidden lg:table-cell">Phone</TableHead>
                  <TableHead className="text-right">Patients</TableHead>
                  <TableHead className="hidden lg:table-cell">Joined</TableHead>
                  <TableHead className="w-10"><span className="sr-only">Open</span></TableHead>
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
                            className="block truncate font-medium hover:underline"
                          >
                            {doctor.name}
                          </Link>
                          <p className="text-muted-foreground truncate text-xs">{doctor.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Tag>{doctor.specialization}</Tag></TableCell>
                    <TableCell className="text-muted-foreground hidden max-w-56 truncate xl:table-cell">
                      {doctor.hospital}
                    </TableCell>
                    <TableCell className="text-muted-foreground tabular hidden lg:table-cell">
                      {formatPhone(doctor.phone)}
                    </TableCell>
                    <TableCell className="text-right">
                      <PatientCount count={doctor.patientCount} />
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden lg:table-cell">
                      {formatDate(doctor.createdAt)}
                    </TableCell>
                    <TableCell>
                      <ChevronRight className="text-muted-foreground size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Mobile cards */}
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

function PatientCount({ count }: { count: number }) {
  return (
    <span className="tabular inline-flex items-center gap-1.5 font-medium">
      <Users className="text-muted-foreground size-3.5" aria-hidden="true" />
      {count}
      <span className="sr-only">patients</span>
    </span>
  );
}

function DoctorCard({ doctor }: { doctor: DoctorListItem }) {
  return (
    <Link href={`/doctors/${doctor._id}`} className="hover:bg-muted/40 flex items-center gap-3 px-4 py-3.5">
      <InitialsAvatar name={doctor.name} />
      <div className="min-w-0 flex-1 space-y-1">
        <p className="truncate font-medium">{doctor.name}</p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Tag>{doctor.specialization}</Tag>
          <span className="text-muted-foreground truncate text-xs">{doctor.hospital}</span>
        </div>
      </div>
      <PatientCount count={doctor.patientCount} />
      <ChevronRight className="text-muted-foreground size-4" aria-hidden="true" />
    </Link>
  );
}

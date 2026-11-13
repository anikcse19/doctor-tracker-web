'use client';

import Link from 'next/link';
import { SearchX, Stethoscope, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/page-header';
import { ListCard, TableSkeleton } from '@/components/shared/list-card';
import { Pagination } from '@/components/shared/pagination';
import { EmptyState, ErrorState } from '@/components/shared/states';
import { formatNumber } from '@/lib/format';
import { useDeletePatient, usePatients } from './api';
import { PatientFilters } from './patient-filters';
import { PatientsTable } from './patients-table';
import { usePatientActions } from './use-patient-actions';
import { usePatientListParams } from './use-patient-list-params';

export function PatientsView() {
  const listState = usePatientListParams();
  const { apiQuery, setParams, reset, activeFilterCount } = listState;
  const { data, isPending, isError, error, refetch, isFetching, isPlaceholderData } = usePatients(apiQuery);
  const deletePatient = useDeletePatient();

  const actions = usePatientActions({
    deletePatient: (id, options) => deletePatient.mutate(id, options),
    isDeleting: deletePatient.isPending,
    onDeleted: () => {
      // Deleting the last row of a page would leave the user on an empty page.
      if (data && data.items.length === 1 && apiQuery.page > 1) setParams({ page: apiQuery.page - 1 });
    },
  });

  const patients = data?.items ?? [];

  return (
    <>
      <PageHeader
        title="Patients"
        description={
          data ? `${formatNumber(data.meta.total)} patients across all doctors` : 'All registered patients'
        }
        actions={
          <Button variant="outline" asChild>
            <Link href="/doctors">
              <Stethoscope /> Add via a doctor
            </Link>
          </Button>
        }
      />

      <ListCard
        isFetching={isFetching && (isPlaceholderData || !isPending)}
        toolbar={<PatientFilters state={listState} />}
      >
        {isPending ? (
          <TableSkeleton />
        ) : isError ? (
          <ErrorState error={error} onRetry={() => refetch()} />
        ) : patients.length === 0 ? (
          activeFilterCount > 0 ? (
            <EmptyState
              icon={SearchX}
              title="No patients match your filters"
              description="Try a different search term, condition or date range."
              action={<Button variant="outline" onClick={reset}>Clear filters</Button>}
            />
          ) : (
            <EmptyState
              icon={Users}
              title="No patients yet"
              description="Patients are registered under a doctor. Open a doctor's profile to add one."
              action={<Button asChild><Link href="/doctors">Go to doctors</Link></Button>}
            />
          )
        ) : (
          <>
            <PatientsTable patients={patients} onEdit={actions.onEdit} onDelete={actions.onDelete} />
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

      {actions.dialogs}
    </>
  );
}

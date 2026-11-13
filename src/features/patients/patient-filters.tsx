'use client';

import { SearchInput } from '@/components/shared/search-input';
import {
  DateRangeChip,
  FacetedFilter,
  ResetFiltersButton,
  SortMenu,
} from '@/components/shared/filters';
import { ListToolbar } from '@/components/shared/list-card';
import { GENDERS, GENDER_LABELS } from '@/lib/constants';
import { useConditions } from './api';
import type { usePatientListParams } from './use-patient-list-params';

const genderOptions = GENDERS.map((value) => ({ value, label: GENDER_LABELS[value] }));

export function PatientFilters({ state }: { state: ReturnType<typeof usePatientListParams> }) {
  const { params, setParams, setFilter, reset, activeFilterCount } = state;
  const { data: conditions = [] } = useConditions();

  return (
    <ListToolbar
      search={
        <SearchInput
          value={params.search}
          onChange={(search) => setFilter({ search })}
          placeholder="Search name, phone, email, condition…"
        />
      }
      filters={
        <>
          <FacetedFilter
            title="Condition"
            options={conditions.map((value) => ({ value, label: value }))}
            selected={params.condition}
            onChange={(condition) => setFilter({ condition })}
          />
          <FacetedFilter
            title="Gender"
            options={genderOptions}
            selected={params.gender}
            onChange={(gender) => setFilter({ gender: gender as typeof params.gender })}
          />
          <DateRangeChip
            title="Registered"
            from={params.from}
            to={params.to}
            onChange={(range) => setFilter(range)}
          />
          <ResetFiltersButton count={activeFilterCount} onReset={reset} />
        </>
      }
      end={<SortMenu value={params.sort} onChange={(sort) => setParams({ sort, page: 1 })} />}
    />
  );
}

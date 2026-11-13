'use client';

import { SearchInput } from '@/components/shared/search-input';
import { FilterSelect } from '@/components/shared/filter-select';
import { DateRangeFilter } from '@/components/shared/date-range-filter';
import { ActiveFilters } from '@/components/shared/list-card';
import { GENDERS, GENDER_LABELS, SORT_OPTIONS } from '@/lib/constants';
import { useConditions } from './api';
import type { usePatientListParams } from './use-patient-list-params';

const genderOptions = GENDERS.map((value) => ({ value, label: GENDER_LABELS[value] }));

export function PatientFilters({ state }: { state: ReturnType<typeof usePatientListParams> }) {
  const { params, setParams, setFilter, reset, activeFilterCount } = state;
  const { data: conditions = [] } = useConditions();

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
      <SearchInput
        value={params.search}
        onChange={(search) => setFilter({ search })}
        placeholder="Search name, phone, email or condition…"
        className="lg:max-w-xs lg:flex-1"
      />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:flex-1 lg:justify-end">
        <FilterSelect
          label="Filter by medical condition"
          allLabel="All conditions"
          value={params.condition}
          options={conditions.map((value) => ({ value, label: value }))}
          onChange={(condition) => setFilter({ condition })}
          className="lg:w-48"
        />
        <FilterSelect
          label="Filter by gender"
          allLabel="All genders"
          value={params.gender}
          options={genderOptions}
          onChange={(value) => setFilter({ gender: value as typeof params.gender })}
          className="lg:w-36"
        />
        <div className="lg:w-48">
          <DateRangeFilter
            from={params.from}
            to={params.to}
            onChange={(range) => setFilter(range)}
            label="Registered"
          />
        </div>
        <FilterSelect
          label="Sort patients"
          allLabel="Newest first"
          value={params.sort === 'newest' ? null : params.sort}
          options={SORT_OPTIONS.filter((option) => option.value !== 'newest')}
          onChange={(value) => setParams({ sort: (value ?? 'newest') as typeof params.sort, page: 1 })}
          className="lg:w-40"
        />
      </div>
      <ActiveFilters count={activeFilterCount} onReset={reset} />
    </div>
  );
}

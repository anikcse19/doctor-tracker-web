'use client';

import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { PAGE_SIZE_OPTIONS, SORT_OPTIONS, SPECIALIZATIONS } from '@/lib/constants';
import { toApiDateRange } from '@/components/shared/date-range-filter';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

const parsers = {
  search: parseAsString.withDefault(''),
  specialization: parseAsStringLiteral(SPECIALIZATIONS),
  hospital: parseAsString,
  from: parseAsString,
  to: parseAsString,
  sort: parseAsStringLiteral(SORT_OPTIONS.map((option) => option.value)).withDefault('newest'),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
};

/**
 * Filter/sort/page state lives in the URL (shareable, survives refresh, back button works).
 * Returns the raw state for the controls and a debounced, API-ready query for fetching.
 */
export function useDoctorListParams() {
  const [params, setParams] = useQueryStates(parsers, { history: 'replace' });
  const search = useDebouncedValue(params.search.trim(), 300);
  const limit = (PAGE_SIZE_OPTIONS as readonly number[]).includes(params.limit) ? params.limit : 10;

  const apiQuery = {
    search: search || undefined,
    specialization: params.specialization ?? undefined,
    hospital: params.hospital ?? undefined,
    ...toApiDateRange(params.from, params.to),
    sort: params.sort,
    page: Math.max(1, params.page),
    limit,
  };

  const activeFilterCount = [params.search, params.specialization, params.hospital, params.from].filter(
    Boolean,
  ).length;

  /** Any filter change returns to page 1 so the user never lands on an empty page. */
  const setFilter = (patch: Partial<typeof params>) => setParams({ ...patch, page: 1 });
  const reset = () =>
    setParams({ search: '', specialization: null, hospital: null, from: null, to: null, page: 1 });

  return { params, apiQuery, setParams, setFilter, reset, activeFilterCount };
}

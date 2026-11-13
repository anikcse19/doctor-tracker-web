'use client';

import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs';
import { GENDERS, PAGE_SIZE_OPTIONS, SORT_OPTIONS } from '@/lib/constants';
import { toApiDateRange } from '@/components/shared/filters';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

const parsers = {
  search: parseAsString.withDefault(''),
  condition: parseAsArrayOf(parseAsString, ',').withDefault([]),
  gender: parseAsArrayOf(parseAsStringLiteral(GENDERS), ',').withDefault([]),
  from: parseAsString,
  to: parseAsString,
  sort: parseAsStringLiteral(SORT_OPTIONS.map((option) => option.value)).withDefault('newest'),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
};

/** URL-backed search/filter/sort/page state for patient tables (shareable, refresh-safe). */
export function usePatientListParams() {
  const [params, setParams] = useQueryStates(parsers, { history: 'replace' });
  const search = useDebouncedValue(params.search.trim(), 300);
  const limit = (PAGE_SIZE_OPTIONS as readonly number[]).includes(params.limit) ? params.limit : 10;

  const apiQuery = {
    search: search || undefined,
    condition: params.condition.join(',') || undefined,
    gender: params.gender.join(',') || undefined,
    ...toApiDateRange(params.from, params.to),
    sort: params.sort,
    page: Math.max(1, params.page),
    limit,
  };

  const activeFilterCount =
    (params.search ? 1 : 0) +
    params.condition.length +
    params.gender.length +
    (params.from ? 1 : 0);

  const setFilter = (patch: Partial<typeof params>) => setParams({ ...patch, page: 1 });
  const reset = () =>
    setParams({ search: '', condition: [], gender: [], from: null, to: null, page: 1 });

  return { params, apiQuery, setParams, setFilter, reset, activeFilterCount };
}

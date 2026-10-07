import type { RepresentativeFilters } from '@civica/contracts'
import { queryOptions } from '@tanstack/react-query'
import { getRepresentative, listRepresentatives } from './functions'
export const representativesQuery = (filters: RepresentativeFilters) =>
  queryOptions({
    queryKey: ['representatives', filters],
    queryFn: () => listRepresentatives({ data: filters }),
    staleTime: 30_000,
  })
export const representativeQuery = (id: string) =>
  queryOptions({
    queryKey: ['person', id],
    queryFn: () => getRepresentative({ data: id }),
    staleTime: 30_000,
  })

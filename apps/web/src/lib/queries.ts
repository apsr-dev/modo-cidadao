import type { ProposalFilters, RepresentativeFilters } from '@civica/contracts'
import { queryOptions } from '@tanstack/react-query'
import { getProposal, getRepresentative, listProposals, listRepresentatives } from './functions'
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
export const proposalsQuery = (filters: ProposalFilters) =>
  queryOptions({
    queryKey: ['proposals', filters],
    queryFn: () => listProposals({ data: filters }),
    staleTime: 30_000,
  })
export const proposalQuery = (id: string) =>
  queryOptions({
    queryKey: ['proposal', id],
    queryFn: () => getProposal({ data: id }),
    staleTime: 30_000,
  })

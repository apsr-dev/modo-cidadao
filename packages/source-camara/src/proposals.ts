import { createHash } from 'node:crypto'
import { type Proposal, reported } from '@civica/domain'
import { z } from 'zod'
import type { RawResponse } from './index'

const hash = (value: string) => createHash('sha256').update(value).digest('hex')
export const PROPOSAL_NORMALIZER_VERSION = 'camara-proposicoes-1'
export function stableProposalId(id: string) {
  const h = hash(`camara:proposicoes:${id}`)
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-5${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`
}
// Only official HTTP(S) destinations may be rendered as links.
const sourceUrl = z
  .string()
  .nullish()
  .transform((value) => {
    if (!value) return null
    try {
      const url = new URL(value)
      return ['http:', 'https:'].includes(url.protocol) &&
        (url.hostname === 'camara.leg.br' || url.hostname.endsWith('.camara.leg.br')) &&
        !url.username &&
        !url.password
        ? url.href
        : null
    } catch {
      return null
    }
  })
const sourceDate = z.union([
  z.iso.datetime({ local: true, offset: true }),
  z.iso.datetime({ local: true, offset: true, precision: -1 }),
])
const hasOffset = (value: string) => /(?:Z|[+-]\d{2}:\d{2})$/.test(value)
function compareSourceDates(a: string, b: string, allHaveOffset: boolean) {
  return allHaveOffset ? Date.parse(a) - Date.parse(b) : a.localeCompare(b)
}
const links = z.array(z.object({ rel: z.string(), href: z.string() })).default([])
const step = z.object({
  dataHora: sourceDate,
  sequencia: z.number().int().nonnegative(),
  siglaOrgao: z.string().nullish(),
  descricaoTramitacao: z.string().nullish(),
  descricaoSituacao: z.string().nullish(),
  despacho: z.string().nullish(),
  url: sourceUrl,
})
export const proposalDetailSchema = z.object({
  dados: z.object({
    id: z.number().int().positive(),
    siglaTipo: z.string().min(1),
    numero: z.number().int().positive(),
    ano: z.number().int().min(1900).max(2100),
    ementa: z.string(),
    descricaoTipo: z.string().nullish(),
    dataApresentacao: sourceDate.nullish(),
    urlInteiroTeor: sourceUrl,
    statusProposicao: z
      .object({ descricaoSituacao: z.string().nullish(), siglaOrgao: z.string().nullish() })
      .nullish(),
  }),
})
export const proposalAuthorsSchema = z.object({
  dados: z.array(
    z.object({
      uri: sourceUrl,
      nome: z.string().min(1),
      codTipo: z.number().int(),
      tipo: z.string().nullish(),
      ordemAssinatura: z.number().int().nonnegative().nullish(),
      proponente: z.union([z.literal(0), z.literal(1)]).nullish(),
    }),
  ),
  links,
})
export const proposalEventsSchema = z.object({ dados: z.array(step).max(1000), links })
export function normalizeProposal(detail: RawResponse, authors: RawResponse, events: RawResponse) {
  const { dados: p } = proposalDetailSchema.parse(JSON.parse(detail.text))
  const a = proposalAuthorsSchema.parse(JSON.parse(authors.text))
  const e = proposalEventsSchema.parse(JSON.parse(events.text))
  const allEventsHaveOffset = e.dados.every((event) => hasOffset(event.dataHora))
  for (const response of [a, e])
    if (response.links.some((l) => l.rel === 'next'))
      throw new Error('INCOMPLETE_PROPOSAL_RESOURCE')
  if ([detail, authors, events].some((r) => r.externalId !== String(p.id)))
    throw new Error('SOURCE_ID_MISMATCH')
  const normalizedAuthors = a.dados.map((author) => ({
    id: hash(`${p.id}:${author.uri ?? author.nome}:${author.codTipo}`),
    name: author.nome,
    type: reported(author.tipo),
    sourceUrl: author.uri,
    deputyExternalId:
      author.uri?.match(
        /^https?:\/\/dadosabertos\.camara\.leg\.br\/api\/v2\/deputados\/(\d+)$/,
      )?.[1] ?? null,
    personId: null,
    signatureOrder: author.ordemAssinatura ?? null,
    proponent:
      author.proponente === undefined || author.proponente === null
        ? null
        : author.proponente === 1,
  }))
  if (new Set(normalizedAuthors.map((author) => author.id)).size !== normalizedAuthors.length)
    throw new Error('DUPLICATE_AUTHOR')
  if (new Set(e.dados.map((event) => event.sequencia)).size !== e.dados.length)
    throw new Error('DUPLICATE_EVENT_SEQUENCE')
  const proposal: Proposal = {
    id: stableProposalId(String(p.id)),
    type: p.siglaTipo,
    number: p.numero,
    year: p.ano,
    title: p.ementa,
    descriptionType: reported(p.descricaoTipo),
    presentedAt: reported(p.dataApresentacao),
    situation: reported(p.statusProposicao?.descricaoSituacao),
    organ: reported(p.statusProposicao?.siglaOrgao),
    fullTextUrl: p.urlInteiroTeor,
    authors: normalizedAuthors,
    events: e.dados
      .map((event) => ({
        sequence: event.sequencia,
        occurredAt: event.dataHora,
        organ: reported(event.siglaOrgao),
        description: reported(event.descricaoTramitacao),
        situation: reported(event.descricaoSituacao),
        dispatch: reported(event.despacho),
        documentUrl: event.url,
      }))
      .sort(
        (a, b) =>
          compareSourceDates(a.occurredAt, b.occurredAt, allEventsHaveOffset) ||
          a.sequence - b.sequence,
      ),
    demo: false,
    authorsCollectedAt: authors.fetchedAt,
    eventsCollectedAt: events.fetchedAt,
    provenance: {
      source: 'camara',
      externalId: String(p.id),
      officialUrl: `https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=${p.id}`,
      resourceUrl: `https://dadosabertos.camara.leg.br/api/v2/proposicoes/${p.id}`,
      fetchedAt: detail.fetchedAt,
      normalizerVersion: PROPOSAL_NORMALIZER_VERSION,
    },
  }
  return {
    proposal,
    revisionHash: hash(
      [PROPOSAL_NORMALIZER_VERSION, detail.hash, authors.hash, events.hash].join(':'),
    ),
  }
}

import { createHash } from 'node:crypto'
import { type Representative, reported } from '@civica/domain'
import { z } from 'zod'
export const BASE_URL = 'https://dadosabertos.camara.leg.br/api/v2'
export const NORMALIZER_VERSION = 'camara-deputados-1'
const status = z.object({
  nome: z.string().min(1),
  siglaUf: z.string().regex(/^[A-Z]{2}$/),
  idLegislatura: z.number().int(),
  siglaPartido: z.string().nullish(),
  situacao: z.string().nullish(),
  email: z.string().nullish(),
  gabinete: z.object({ telefone: z.string().nullish() }).nullish(),
})
export const detailSchema = z.object({
  dados: z.object({
    id: z.number().int().positive(),
    nomeCivil: z.string().nullish(),
    ultimoStatus: status,
  }),
})
export const listSchema = z.object({
  dados: z.array(z.object({ id: z.number().int().positive() })),
  links: z.array(z.object({ rel: z.string(), href: z.url() })).default([]),
})
export function stablePersonId(externalId: string) {
  const hash = createHash('sha256').update(`camara:deputados:${externalId}`).digest('hex')
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-5${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`
}
export function normalizeDeputy(payload: unknown, fetchedAt: string): Representative {
  const { dados } = detailSchema.parse(payload)
  const last = dados.ultimoStatus
  return {
    id: stablePersonId(String(dados.id)),
    name: last.nome,
    civilName: reported(dados.nomeCivil),
    uf: last.siglaUf,
    legislature: String(last.idLegislatura),
    institution: 'camara',
    party: reported(last.siglaPartido),
    status: reported(last.situacao),
    email: reported(last.email && z.email().safeParse(last.email).success ? last.email : null),
    phone: reported(last.gabinete?.telefone),
    demo: false,
    provenance: {
      source: 'camara',
      externalId: String(dados.id),
      officialUrl: `https://www.camara.leg.br/deputados/${dados.id}`,
      resourceUrl: `${BASE_URL}/deputados/${dados.id}`,
      fetchedAt,
      normalizerVersion: NORMALIZER_VERSION,
    },
  }
}
export interface RawResponse {
  url: string
  text: string
  fetchedAt: string
  externalId: string
  resource: 'deputados-lista' | 'deputado'
  hash: string
  sourceHash: string
  redactedFields: string[]
}
export function minimizeRaw(text: string, resource: RawResponse['resource']) {
  const sourceHash = createHash('sha256').update(text).digest('hex')
  const redactedFields: string[] = []
  if (resource === 'deputado') {
    const json = JSON.parse(text)
    if (json?.dados && Object.hasOwn(json.dados, 'cpf')) {
      delete json.dados.cpf
      redactedFields.push('dados.cpf')
      text = JSON.stringify(json)
    }
  }
  return { text, sourceHash, redactedFields, hash: createHash('sha256').update(text).digest('hex') }
}
export class SourceError extends Error {
  constructor(public readonly code: string) {
    super(code)
  }
}
export function camaraClient(
  fetcher: (url: string, init: RequestInit) => Promise<Response> = fetch,
) {
  async function read(
    url: string,
    signal: AbortSignal,
    externalId: string,
    resource: RawResponse['resource'],
  ): Promise<RawResponse> {
    for (let attempt = 0; attempt < 3; attempt++) {
      signal.throwIfAborted()
      const response = await fetcher(url, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.any([signal, AbortSignal.timeout(15000)]),
      })
      if ((response.status === 429 || response.status >= 500) && attempt < 2) {
        const retry = response.headers.get('retry-after')
        const seconds = retry ? Number(retry) : NaN
        const delay = Number.isFinite(seconds)
          ? seconds * 1000
          : retry && Number.isFinite(Date.parse(retry))
            ? Date.parse(retry) - Date.now()
            : 400 * 2 ** attempt
        await new Promise<void>((resolve, reject) => {
          const abort = () => {
            clearTimeout(timer)
            reject(new SourceError('ABORTED'))
          }
          const timer = setTimeout(
            () => {
              signal.removeEventListener('abort', abort)
              resolve()
            },
            Math.max(0, Math.min(10000, delay)),
          )
          signal.addEventListener('abort', abort, { once: true })
        })
        continue
      }
      if (!response.ok) throw new SourceError(`HTTP_${response.status}`)
      const text = await response.text()
      return {
        url,
        ...minimizeRaw(text, resource),
        fetchedAt: new Date().toISOString(),
        externalId,
        resource,
      }
    }
    throw new SourceError('RETRIES_EXHAUSTED')
  }
  return {
    list(page: number, pageSize: number, signal: AbortSignal) {
      return read(
        `${BASE_URL}/deputados?ordem=ASC&ordenarPor=nome&pagina=${page}&itens=${pageSize}`,
        signal,
        String(page),
        'deputados-lista',
      )
    },
    detail(id: number, signal: AbortSignal) {
      return read(`${BASE_URL}/deputados/${id}`, signal, String(id), 'deputado')
    },
  }
}

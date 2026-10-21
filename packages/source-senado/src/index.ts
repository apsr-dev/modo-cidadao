import { createHash } from 'node:crypto'
import { type Representative, reported } from '@civica/domain'
import { z } from 'zod'

export const LIST_URL = 'https://legis.senado.leg.br/dadosabertos/senador/lista/atual?v=4'
export const NORMALIZER_VERSION = 'senado-senadores-1'
const id = z.string().regex(/^[1-9]\d*$/)
const date = z.iso.date()
const legislature = z.object({
  NumeroLegislatura: id,
  DataInicio: date,
  DataFim: date,
})
const exercise = z.object({
  CodigoExercicio: id,
  DataInicio: date.nullish(),
  DataFim: date.nullish(),
  SiglaCausaAfastamento: z.string().nullish(),
  DescricaoCausaAfastamento: z.string().nullish(),
})
// Jackson can represent one XML element as an object or an array in JSON.
const many = <T extends z.ZodType>(schema: T) =>
  z.union([z.array(schema), schema.transform((value) => [value])])
const senator = z.object({
  IdentificacaoParlamentar: z.object({
    CodigoParlamentar: id,
    NomeParlamentar: z.string().min(1),
    NomeCompletoParlamentar: z.string().nullish(),
    UfParlamentar: z
      .string()
      .regex(
        /^(AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO)$/,
      ),
    SiglaPartidoParlamentar: z.string().nullish(),
    EmailParlamentar: z.string().nullish(),
    UrlPaginaParlamentar: z.string(),
    UrlFotoParlamentar: z.unknown().optional(),
    Telefones: z
      .object({
        Telefone: many(
          z.object({
            NumeroTelefone: z.string(),
            OrdemPublicacao: z.string(),
            IndicadorFax: z.string(),
          }),
        ),
      })
      .nullish(),
  }),
  Mandato: z.object({
    CodigoMandato: id,
    DescricaoParticipacao: z.string().nullish(),
    PrimeiraLegislaturaDoMandato: legislature,
    SegundaLegislaturaDoMandato: legislature.optional(),
    Exercicios: z.object({ Exercicio: many(exercise) }).nullish(),
  }),
})
export const listSchema = z.object({
  ListaParlamentarEmExercicio: z.object({
    Metadados: z.object({ VersaoServico: z.literal('4'), Versao: z.string() }),
    Parlamentares: z.object({ Parlamentar: many(senator) }),
  }),
})
export function stableSenatorId(externalId: string) {
  const hash = createHash('sha256').update(`senado:senadores:${externalId}`).digest('hex')
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-5${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`
}
function officialUrl(value: unknown, host: string, path: string): string | null {
  if (typeof value !== 'string') return null
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) &&
      url.hostname === host &&
      !url.username &&
      !url.password &&
      !url.port &&
      !url.search &&
      !url.hash &&
      url.pathname === path
      ? value
      : null
  } catch {
    return null
  }
}
export function normalizeSenators(payload: unknown, fetchedAt: string): Representative[] {
  z.iso.datetime().parse(fetchedAt)
  const records = listSchema.parse(payload).ListaParlamentarEmExercicio.Parlamentares.Parlamentar
  const seen = new Set<string>()
  return records.map((record) => {
    const p = record.IdentificacaoParlamentar
    const m = record.Mandato
    if (seen.has(p.CodigoParlamentar)) throw new Error('SENADO_DUPLICATE_ID')
    seen.add(p.CodigoParlamentar)
    const page = officialUrl(
      p.UrlPaginaParlamentar,
      'www25.senado.leg.br',
      `/web/senadores/senador/-/perfil/${p.CodigoParlamentar}`,
    )
    if (!page) throw new Error('SENADO_INVALID_OFFICIAL_URL')
    const legislatures = [
      m.PrimeiraLegislaturaDoMandato,
      ...(m.SegundaLegislaturaDoMandato ? [m.SegundaLegislaturaDoMandato] : []),
    ]
    const phone = p.Telefones?.Telefone.filter((t) => t.IndicadorFax === 'Não').sort(
      (a, b) => Number(a.OrdemPublicacao) - Number(b.OrdemPublicacao),
    )[0]?.NumeroTelefone
    return {
      id: stableSenatorId(p.CodigoParlamentar),
      name: p.NomeParlamentar,
      civilName: reported(p.NomeCompletoParlamentar),
      uf: p.UfParlamentar,
      legislature: legislatures.map((l) => l.NumeroLegislatura).join(' / '),
      institution: 'senado',
      senateMandate: {
        externalId: m.CodigoMandato,
        participation: reported(m.DescricaoParticipacao),
        legislatures: legislatures.map((l) => ({
          number: l.NumeroLegislatura,
          start: l.DataInicio,
          end: l.DataFim,
        })),
        exercises: (m.Exercicios?.Exercicio ?? []).map((e) => ({
          externalId: e.CodigoExercicio,
          start: e.DataInicio ?? null,
          end: e.DataFim ?? null,
          endReasonCode: e.SiglaCausaAfastamento ?? null,
          endReason: e.DescricaoCausaAfastamento ?? null,
        })),
      },
      party: reported(p.SiglaPartidoParlamentar),
      // Membership of this specific resource is an observation of exercise, not a legal date.
      status: reported('Em exercício na lista atual do Senado'),
      email: reported(z.email().safeParse(p.EmailParlamentar).success ? p.EmailParlamentar : null),
      phone: reported(phone),
      photo: reported(
        officialUrl(
          p.UrlFotoParlamentar,
          'www.senado.leg.br',
          `/senadores/img/fotos-oficiais/senador${p.CodigoParlamentar}.jpg`,
        ),
      ),
      demo: false,
      provenance: {
        source: 'senado',
        externalId: p.CodigoParlamentar,
        officialUrl: page,
        resourceUrl: LIST_URL,
        fetchedAt,
        normalizerVersion: NORMALIZER_VERSION,
      },
    }
  })
}
export function senadoClient(fetcher: typeof fetch = fetch) {
  return {
    async list(signal: AbortSignal) {
      for (let attempt = 0; attempt < 3; attempt++) {
        signal.throwIfAborted()
        const response = await fetcher(LIST_URL, {
          headers: { Accept: 'application/json' },
          redirect: 'error',
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
              reject(new Error('SENADO_ABORTED'))
            }
            const timer = setTimeout(
              () => {
                signal.removeEventListener('abort', abort)
                resolve()
              },
              Math.max(0, Math.min(10000, delay)),
            )
            signal.addEventListener('abort', abort, { once: true })
            if (signal.aborted) abort()
          })
          continue
        }
        if (!response.ok) throw new Error(`SENADO_HTTP_${response.status}`)
        if (!response.headers.get('content-type')?.includes('application/json'))
          throw new Error('SENADO_EXPECTED_JSON')
        const text = await response.text()
        const hash = createHash('sha256').update(text).digest('hex')
        return {
          source: 'senado' as const,
          resource: 'senadores-atuais',
          externalId: 'atual',
          url: LIST_URL,
          text,
          hash,
          sourceHash: hash,
          redactedFields: [],
          fetchedAt: new Date().toISOString(),
        }
      }
      throw new Error('SENADO_RETRIES_EXHAUSTED')
    },
  }
}

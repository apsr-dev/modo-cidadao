import { createHash } from 'node:crypto'
import { connectDatabase } from '@civica/db'
import { normalizeSenators } from '@civica/source-senado'
import { requireLocal } from '../../scripts/local-only'
import fixture from '../fixtures/senado-current.json'
import { expect, test } from './fixtures'

test.skip(process.env.E2E_INTEGRATION !== '1', 'Catálogo oficial local opt-in')
const people = normalizeSenators(fixture, '2026-10-21T12:00:00.000Z')
test.beforeAll(async () => {
  const db = connectDatabase(requireLocal(process.env.DATABASE_URL, 'DATABASE_URL'))
  try {
    const text = JSON.stringify(fixture),
      hash = createHash('sha256').update(text).digest('hex')
    const snapshot = await db.saveRaw({
      source: 'senado',
      resource: 'senadores-atuais',
      externalId: 'fixture-e2e',
      url: people[0]?.provenance.resourceUrl ?? '',
      text,
      hash,
      sourceHash: hash,
      redactedFields: [],
      fetchedAt: '2026-10-21T12:00:00.000Z',
    })
    for (const p of people) await db.upsertRepresentative(p, snapshot)
  } finally {
    await db.close()
  }
})
test('Senado: busca e perfil público preservam fonte, suplência, exercício e limites', async ({
  page,
  request,
}, testInfo) => {
  const person = people[1]
  if (!person) throw new Error('FIXTURE_MISSING')
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  const result = await request.get(
    '/api/v1/representatives?name=Ana%20Paula%20Lobato&uf=MA&pageSize=1',
  )
  expect(result.status()).toBe(200)
  const data = await result.json()
  expect(data.items[0]).toMatchObject({
    id: person.id,
    institution: 'senado',
    provenance: { source: 'senado' },
  })
  const detail = await request.get(`/api/v1/people/${person.id}`)
  expect((await detail.json()).senateMandate.participation.value).toBe('1º Suplente')
  const ssr = await request.get(`/representantes/${person.id}`)
  const html = await ssr.text()
  expect(html).toContain('Senado Federal')
  expect(html).toContain('1º Suplente')
  expect(html).toContain('2026-10-06')
  expect(html).not.toContain('Fonte: Dados Abertos da Câmara')
  await page.goto('/representantes?name=Ana%20Paula%20Lobato&uf=MA&pageSize=1')
  const card = page.locator('.person-card')
  await expect(card.getByText('Senador', { exact: false })).toBeVisible()
  await expect(card.getByText('Senado Federal', { exact: true })).toHaveCount(1)
  await card.click()
  await expect(page.getByRole('heading', { name: person.name, exact: true })).toBeVisible()
  await expect(page.getByText('1º Suplente', { exact: true })).toBeVisible()
  await expect(
    page.getByText('Matérias do Senado ainda não integradas.', { exact: false }),
  ).toBeVisible()
  await expect(page.getByRole('link', { name: 'Abrir perfil oficial' })).toHaveAttribute(
    'href',
    person.provenance.officialUrl ?? '',
  )
  await expect(
    page
      .locator('.profile-header')
      .getByRole('img', { name: `Foto oficial de ${person.name} — Senado Federal` }),
  ).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  expect(errors).toEqual([])
  await page.screenshot({
    path: `test-results/senado-profile-${testInfo.project.name}.png`,
    fullPage: true,
  })
})

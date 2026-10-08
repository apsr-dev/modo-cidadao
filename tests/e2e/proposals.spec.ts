import { expect, test } from '@playwright/test'

const integrated = process.env.E2E_INTEGRATION === '1'
test('representante → proposta → tramitação → documento oficial; filtros e SSR', async ({
  page,
  request,
}) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  const catalog = await request.get('/api/v1/proposals?pageSize=1')
  expect(catalog.status()).toBe(200)
  const p = (await catalog.json()).items[0]
  expect(p).toBeDefined()
  const detail = await (await request.get(`/api/v1/proposals/${p.id}`)).json()
  const author = detail.authors.find((a: { personId: string | null }) => a.personId)
  expect(author).toBeDefined()
  const ssr = await request.get(`/propostas/${p.id}`)
  expect(ssr.status()).toBe(200)
  const html = await ssr.text()
  expect(html).toContain(p.title)
  expect(html).toContain('name="description"')
  expect(html).toContain('rel="canonical"')
  expect((await request.get('/api/v1/proposals?year=1800')).status()).toBe(400)
  expect((await request.get('/api/v1/proposals?number=0')).status()).toBe(400)
  expect((await request.get('/api/v1/proposals/not-a-uuid')).status()).toBe(400)
  expect((await request.get('/propostas/00000000-0000-4000-9000-999999999998')).status()).toBe(404)
  expect(
    (await request.get('/api/v1/proposals/00000000-0000-4000-9000-999999999998')).status(),
  ).toBe(404)
  await page.goto(`/representantes/${author.personId}`)
  await expect(
    page.getByRole('heading', { name: 'Propostas de autoria e coautoria' }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Ver todas as propostas importadas' }).click()
  expect(new URL(page.url()).searchParams.get('authorId')).toBe(author.personId)
  await page.locator('.proposal-card').first().click()
  await expect(page.getByRole('heading', { name: 'Autoria e coautoria' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Tramitação', exact: true })).toBeVisible()
  if (integrated)
    await expect(page.getByRole('link', { name: 'Abrir texto oficial' })).toHaveAttribute(
      'href',
      /^https:\/\/www\.camara\.leg\.br\//,
    )
  else await expect(page.getByText('Proposta, personagens e tramitações fictícios.')).toBeVisible()
  await page.goto(`/propostas?type=${p.type}&number=${p.number}&year=${p.year}`)
  await expect(page.locator('.proposal-card')).toHaveCount(1)
  await page.getByLabel('Número', { exact: true }).fill('999999')
  await page.getByRole('button', { name: 'Buscar', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Nenhuma proposta importada nesta busca' }),
  ).toBeVisible()
  if (!integrated) {
    await page.goto('/propostas?pageSize=2&year=2026&type=PL')
    await page.getByRole('link', { name: 'Próxima →' }).click()
    const search = new URL(page.url()).searchParams
    expect(search.get('year')).toBe('2026')
    expect(search.get('type')).toBe('PL')
    expect(search.get('pageSize')).toBe('2')
    await expect(page.getByText('Página 2 de 4')).toBeVisible()
  }
  expect(errors).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

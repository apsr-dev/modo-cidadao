import type { Representative } from '@civica/contracts'
import { expect, officialPortrait, portraitPng, test } from './fixtures'

const integrated = process.env.E2E_INTEGRATION === '1'

test('demo usa iniciais acessíveis e permite abrir o perfil sem fotos', async ({ page }) => {
  test.skip(integrated, 'Catálogo fictício')
  let imageRequests = 0
  await page.route(officialPortrait, async (route) => {
    imageRequests++
    await route.abort()
  })
  await page.goto('/representantes')
  const first = page.locator('.person-card').first()
  await expect(first.getByRole('img', { name: /Representação por iniciais de/ })).toBeVisible()
  await expect(page.locator('[data-slot="avatar-image"]')).toHaveCount(0)
  await first.click()
  await expect(
    page.locator('.profile-header').getByRole('img', { name: /Representação por iniciais de/ }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Origem e cobertura' })).toBeVisible()
  expect(imageRequests).toBe(0)
})

for (const outcome of ['loaded', 'not-found', 'invalid-image'] as const) {
  test(`foto oficial ${outcome} no diretório e perfil`, async ({ page, request }) => {
    test.skip(!integrated, 'Catálogo oficial local opt-in')
    const response = await request.get('/api/v1/representatives?pageSize=6')
    expect(response.status()).toBe(200)
    const body = (await response.json()) as { items: Representative[] }
    const person = body.items.find((p) => p.photo.state === 'available')
    expect(person, 'A fixture oficial/coleta deve ter foto disponível').toBeDefined()
    if (!person) throw new Error('OFFICIAL_PHOTO_FIXTURE_MISSING')
    let imageRequests = 0
    const available = outcome === 'loaded'
    await page.route(officialPortrait, async (route) => {
      imageRequests++
      expect(route.request().headers().referer).toBeUndefined()
      // Deterministic image bytes only for the browser test; no government request.
      await route.fulfill(
        available
          ? {
              status: 200,
              contentType: 'image/png',
              body: portraitPng,
            }
          : outcome === 'invalid-image'
            ? { status: 200, contentType: 'image/jpeg', body: 'invalid image bytes' }
            : { status: 404, body: '' },
      )
    })
    await page.goto('/representantes')
    const card = page
      .locator('.person-card')
      .filter({ has: page.getByRole('heading', { name: person.name, exact: true }) })
    const label = available
      ? `Foto oficial de ${person.name} — Câmara dos Deputados`
      : `Representação por iniciais de ${person.name}`
    await expect.poll(() => imageRequests).toBeGreaterThan(0)
    await expect(card.getByRole('img', { name: label, exact: true })).toBeVisible()
    if (available) {
      await expect(card.locator('[data-slot="avatar-fallback"]')).toHaveCount(0)
      await expect(card.locator('img')).toHaveAttribute('src', person.photo.value ?? '')
    } else {
      await expect(card.locator('img')).toHaveCount(0)
    }
    await card.click()
    await expect(page.getByRole('heading', { name: person.name, exact: true })).toBeVisible()
    await expect(
      page.locator('.profile-header').getByRole('img', { name: label, exact: true }),
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Imagem oficial da Câmara dos Deputados' }),
    ).toHaveAttribute('href', person.photo.value ?? '')
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
  })
}

test('mantém iniciais enquanto a foto carrega e as substitui após a resposta', async ({
  page,
  request,
}) => {
  test.skip(!integrated, 'Catálogo oficial local opt-in')
  const response = await request.get('/api/v1/representatives?pageSize=6')
  const { items } = (await response.json()) as { items: Representative[] }
  const person = items.find((item) => item.photo.state === 'available')
  if (!person) throw new Error('OFFICIAL_PHOTO_FIXTURE_MISSING')
  let releaseImage = () => {}
  const pendingImage = new Promise<void>((resolve) => {
    releaseImage = resolve
  })
  await page.route(officialPortrait, async (route) => {
    await pendingImage
    await route.fulfill({ status: 200, contentType: 'image/png', body: portraitPng })
  })
  try {
    await page.goto('/representantes', { waitUntil: 'domcontentloaded' })
    const card = page.locator('.person-card').filter({
      has: page.getByRole('heading', { name: person.name, exact: true }),
    })
    await expect(
      card.getByRole('img', { name: `Representação por iniciais de ${person.name}` }),
    ).toBeVisible()
    releaseImage()
    await expect(
      card.getByRole('img', { name: `Foto oficial de ${person.name} — Câmara dos Deputados` }),
    ).toBeVisible()
    await expect(card.locator('[data-slot="avatar-fallback"]')).toHaveCount(0)
  } finally {
    releaseImage()
  }
})

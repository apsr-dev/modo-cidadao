import type { Representative } from '@civica/contracts'
import { expect, test } from '@playwright/test'

const integrated = process.env.E2E_INTEGRATION === '1'
const officialPortrait = /^https:\/\/www\.camara\.leg\.br\/internet\/deputado\/bandep\/\d+\.jpg$/

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

for (const available of [true, false]) {
  test(`foto oficial ${available ? 'carrega' : 'falha com fallback'} no diretório e perfil`, async ({
    page,
    request,
  }) => {
    test.skip(!integrated, 'Catálogo oficial local opt-in')
    const response = await request.get('/api/v1/representatives?pageSize=6')
    expect(response.status()).toBe(200)
    const body = (await response.json()) as { items: Representative[] }
    const person = body.items.find((p) => p.photo.state === 'available')
    expect(person, 'A fixture oficial/coleta deve ter foto disponível').toBeDefined()
    if (!person) throw new Error('OFFICIAL_PHOTO_FIXTURE_MISSING')
    let imageRequests = 0
    await page.route(officialPortrait, async (route) => {
      imageRequests++
      expect(route.request().headers().referer).toBeUndefined()
      // Deterministic image bytes only for the browser test; no government request.
      await route.fulfill(
        available
          ? {
              status: 200,
              contentType: 'image/png',
              body: Buffer.from(
                'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aGTsAAAAASUVORK5CYII=',
                'base64',
              ),
            }
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

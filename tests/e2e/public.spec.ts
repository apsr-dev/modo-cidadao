import { expect, test } from '@playwright/test'

const integrated = process.env.E2E_INTEGRATION === '1'
test('SSR, metadados e REST validam o catálogo e seus filtros', async ({ request }) => {
  const home = await request.get('/')
  expect(home.status()).toBe(200)
  const html = await home.text()
  expect(html).toContain('A cidadania continua')
  expect(html).toContain('name="description"')
  expect(html).toContain('rel="canonical"')
  const response = await request.get('/api/v1/representatives?pageSize=1')
  expect(response.status()).toBe(200)
  const body = await response.json()
  expect(body.items).toHaveLength(1)
  const person = body.items[0]
  const profile = await request.get(`/representantes/${person.id}`)
  expect(profile.status()).toBe(200)
  expect(await profile.text()).toContain(person.name)
  expect((await request.get('/api/v1/representatives?uf=XX')).status()).toBe(400)
  expect((await request.get('/api/v1/representatives?page=0')).status()).toBe(400)
  expect((await request.get('/representantes/00000000-0000-4000-8000-999999999999')).status()).toBe(
    404,
  )
  expect((await request.get('/pagina-inexistente')).status()).toBe(404)
  const personal = await request.get('/api/v1/me/follows')
  expect(personal.status()).toBe(integrated ? 401 : 503)
  expect(personal.headers()['cache-control']).toContain('no-store')
  const attack = await request.put(`/api/v1/me/follows/people/${person.id}`, {
    headers: { Origin: 'https://evil.example' },
  })
  expect(attack.status()).toBe(403)
})
test('busca, paginação, perfil e navegação funcionam sem erros de hidratação', async ({
  page,
}, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /A cidadania continua/ })).toBeVisible()
  await page.getByRole('link', { name: 'Encontrar representantes' }).click()
  await expect(page.getByRole('heading', { name: 'Representantes', exact: true })).toBeVisible()
  if (!integrated) {
    await page.getByRole('link', { name: 'Próxima →' }).click()
    await expect(page.getByText('Página 2 de 2')).toBeVisible()
    await page.getByRole('textbox', { name: 'Nome do representante' }).fill('Aurora')
    await page.getByLabel('Unidade federativa').selectOption('SP')
    await page.getByRole('button', { name: 'Buscar' }).click()
    await expect(page.getByRole('heading', { name: 'Aurora das Pontes' })).toBeVisible()
    await page.getByRole('link', { name: /Aurora das Pontes/ }).click()
    await expect(
      page.getByText('Dados fictícios para demonstração. Não correspondem a políticos reais.'),
    ).toBeVisible()
  } else {
    await page.locator('.person-card').first().click()
    await expect(page.getByRole('heading', { name: 'Origem e cobertura' })).toBeVisible()
  }
  await page.goto('/votacoes')
  await expect(page.getByRole('heading', { name: 'Integração ainda não disponível' })).toBeVisible()
  await page.goto('/participe')
  await expect(page.getByRole('link', { name: 'Ir ao canal oficial' })).toHaveCount(2)
  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Abrir navegação' }).click()
    await page
      .getByRole('navigation', { name: 'Navegação principal' })
      .getByRole('link', { name: 'Meu Brasil' })
      .click()
  } else {
    await page.getByRole('link', { name: 'Minha área' }).click()
  }
  if (!integrated)
    await expect(
      page.getByRole('heading', { name: 'Conta indisponível na demonstração' }),
    ).toBeVisible()
  expect(errors).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
})

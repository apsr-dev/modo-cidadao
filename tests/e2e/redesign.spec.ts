import { expect, test } from '@playwright/test'

test('landing separada do app mantém a descoberta por UF e os links públicos', async ({
  page,
  request,
}, testInfo) => {
  if (testInfo.project.name === 'mobile') await page.setViewportSize({ width: 320, height: 740 })
  const html = await (await request.get('/')).text()
  expect(html).toContain('marketing-shell')
  expect(html).not.toContain('class="app-shell"')
  await page.goto('/')
  await expect(page.getByRole('navigation', { name: 'Navegação principal' })).toHaveCount(0)
  await page.getByRole('link', { name: 'Explorar a plataforma', exact: true }).first().click()
  await expect(page.getByRole('heading', { name: 'Explorar', exact: true })).toBeVisible()
  expect(
    await page
      .locator('.person-card')
      .evaluateAll((rows) => rows.every((row) => row.scrollWidth <= row.clientWidth)),
  ).toBe(true)
  if (testInfo.project.name === 'mobile') {
    const toggle = page.getByRole('button', { name: 'Abrir navegação' })
    await toggle.click()
    const nav = page.getByRole('navigation', { name: 'Navegação principal' })
    await expect(nav).toBeVisible()
    await nav.getByRole('link', { name: 'Explorar', exact: true }).press('Escape')
    await expect(nav).not.toBeVisible()
    await expect(toggle).toBeFocused()
  } else {
    await expect(
      page
        .getByRole('navigation', { name: 'Navegação principal' })
        .getByRole('link', { name: 'Explorar', exact: true }),
    ).toHaveAttribute('aria-current', 'page')
  }
  await page.getByRole('combobox', { name: 'Seu estado', exact: true }).click()
  await page.getByRole('option', { name: 'SP', exact: true }).click()
  await page.getByRole('button', { name: 'Encontrar representantes', exact: true }).click()
  await expect(page).toHaveURL(/\/representantes\?.*uf=SP/)
  await expect(page.getByRole('combobox', { name: 'UF de representação' })).toHaveText('SP')
  const catalog = await (await request.get('/api/v1/representatives?uf=SP')).json()
  await expect(page.locator('.person-card')).toHaveCount(catalog.items.length)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test.describe('apresentação sem JavaScript', () => {
  test.use({ javaScriptEnabled: false })
  test('landing mantém apresentação, âncoras e entrada pública', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /A cidadania continua/ })).toBeVisible()
    await expect(page.locator('.landing-photo')).toHaveJSProperty('complete', true)
    await page.getByRole('link', { name: 'Explorar a plataforma', exact: true }).first().click()
    await expect(page.getByRole('heading', { name: 'Explorar', exact: true })).toBeVisible()
    await expect(page.getByLabel('Seu estado', { exact: true })).toBeVisible()
  })
})

const integrated = process.env.E2E_INTEGRATION === '1'

test('home apresenta fontes e cobertura do modo ativo no HTML inicial', async ({
  page,
  request,
}) => {
  const response = await request.get('/')
  expect(response.status()).toBe(200)
  const html = await response.text()
  expect(html).toContain(integrated ? 'Catálogo local da Câmara' : 'Você está na demonstração')
  await page.goto('/')
  const sources = page.getByRole('region', { name: 'Saiba de onde vem cada informação.' })
  await expect(sources.getByRole('link', { name: 'Dados Abertos da Câmara' })).toHaveAttribute(
    'href',
    'https://dadosabertos.camara.leg.br/',
  )
  await expect(sources).toContainText('ainda não estão integrados nesta versão')
  if (integrated) {
    await expect(sources).toContainText(
      'não há garantia de cobertura completa nem atualização automática',
    )
    await expect(sources).toContainText('Coleta não é a data de atualização oficial')
  } else {
    await expect(sources).toContainText('personagens fictícios')
    await expect(sources).toContainText('não salva acompanhamentos nem cria contas')
  }
  await expect(page.getByLabel('E-mail', { exact: true })).toHaveCount(0)
  await page.getByRole('link', { name: 'Consultar canais oficiais' }).click()
  await expect(page.getByRole('link', { name: 'Ir ao canal oficial' })).toHaveCount(2)
})

test('URLs públicas mantêm layout de consulta e conta fica restrita à persistência', async ({
  page,
  request,
}) => {
  for (const path of [
    '/app',
    '/representantes',
    '/propostas',
    '/votacoes',
    '/participe',
    '/eleicoes',
  ]) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(200)
    const html = await response.text()
    expect(html, path).toContain('class="app-shell"')
    expect(html, path).not.toContain('class="marketing-shell"')
    await page.goto(path)
    await expect(page.getByLabel('E-mail', { exact: true })).toHaveCount(0)
  }
  await page.goto('/meu-brasil')
  if (integrated) {
    await expect(page.getByRole('heading', { name: 'Entre na sua conta' })).toBeVisible()
    await expect(page.getByText('A conta serve para salvar seus acompanhamentos.')).toBeVisible()
    await page.getByRole('link', { name: 'Continuar sem conta' }).click()
  } else {
    await expect(
      page.getByRole('heading', { name: 'Conta indisponível na demonstração' }),
    ).toBeVisible()
    await page.getByRole('link', { name: 'Explorar a demonstração' }).click()
  }
  await expect(page.getByRole('heading', { name: 'Representantes', exact: true })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('diretório preserva partido, cargo e UF nas larguras de desktop e celular', async ({
  page,
  request,
}) => {
  const data = await (await request.get('/api/v1/representatives?pageSize=1')).json()
  const person = data.items[0]
  expect(person.party.value).toBeTruthy()
  for (const width of [320, 800, 1150, 1280]) {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/representantes?pageSize=1')
    const row = page.locator('.person-card').first()
    await expect(row.getByRole('heading', { name: person.name, exact: true })).toBeVisible()
    await expect(
      row.getByText(person.party.value, { exact: true }).filter({ visible: true }),
    ).toHaveCount(1)
    await expect(row.getByText(/Deputado federal/)).toBeVisible()
    await expect(row.getByText(`UF de representação: ${person.uf}`, { exact: true })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

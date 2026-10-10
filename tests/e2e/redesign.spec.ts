import { expect, test } from '@playwright/test'

test('landing separada do app mantém a descoberta por UF e os links públicos', async ({
  page,
  request,
}, testInfo) => {
  const html = await (await request.get('/')).text()
  expect(html).toContain('marketing-shell')
  expect(html).not.toContain('class="app-shell"')
  await page.goto('/')
  await expect(page.getByRole('navigation', { name: 'Navegação principal' })).toHaveCount(0)
  await page.getByRole('link', { name: 'Explorar a plataforma', exact: true }).first().click()
  await expect(page.getByRole('heading', { name: 'Explorar', exact: true })).toBeVisible()
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
  await page.getByLabel('Seu estado', { exact: true }).selectOption('SP')
  await page.getByRole('button', { name: 'Encontrar representantes', exact: true }).click()
  await expect(page).toHaveURL(/\/representantes\?.*uf=SP/)
  await expect(page.getByLabel('Unidade federativa')).toHaveValue('SP')
  const catalog = await (await request.get('/api/v1/representatives?uf=SP')).json()
  await expect(page.locator('.person-card')).toHaveCount(catalog.items.length)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('landing sem JavaScript mantém apresentação, âncoras e entrada pública', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL })
  try {
    const page = await context.newPage()
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /A cidadania continua/ })).toBeVisible()
    await expect(page.locator('.landing-photo')).toHaveJSProperty('complete', true)
    await page.getByRole('link', { name: 'Explorar a plataforma', exact: true }).first().click()
    await expect(page.getByRole('heading', { name: 'Explorar', exact: true })).toBeVisible()
    await expect(page.getByLabel('Seu estado', { exact: true })).toBeVisible()
  } finally {
    await context.close()
  }
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

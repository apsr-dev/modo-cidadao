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

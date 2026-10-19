import { expect, test } from '@playwright/test'

test('Select permite navegar por teclado, cancelar e selecionar a última UF', async ({ page }) => {
  await page.goto('/app')
  const trigger = page.getByRole('combobox', { name: 'Seu estado', exact: true })
  await expect(trigger).toHaveAttribute('data-slot', 'select-trigger')
  await trigger.focus()
  await trigger.press('Enter')
  const list = page.getByRole('listbox')
  await expect(list).toBeVisible()
  await expect(page.getByRole('option')).toHaveCount(28)
  await page.keyboard.press('Escape')
  await expect(list).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await trigger.press('ArrowDown')
  await page.keyboard.press('End')
  await expect(page.getByRole('option', { name: 'TO', exact: true })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(trigger).toHaveText('TO')
  await expect(list).toHaveCount(0)
  await page.getByRole('button', { name: 'Encontrar representantes', exact: true }).click()
  await expect(page).toHaveURL(/uf=TO/)
  await expect(page.getByRole('combobox', { name: 'Unidade federativa' })).toHaveText('TO')
})

test('Select limpa a UF sem enviar o sentinela e preserva o tamanho da página', async ({
  page,
}, testInfo) => {
  await page.goto('/representantes?uf=SP&page=2&pageSize=1')
  const trigger = page.getByRole('combobox', { name: 'Unidade federativa' })
  await expect(trigger).toHaveAttribute('data-slot', 'select-trigger')
  await expect(trigger).toHaveText('SP')
  if (testInfo.project.name === 'mobile') await trigger.tap()
  else await trigger.click()
  await expect(page.getByRole('option', { name: 'SP', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  const all = page.getByRole('option', { name: 'Todas as UFs', exact: true })
  await all.scrollIntoViewIfNeeded()
  if (testInfo.project.name === 'mobile') await all.tap()
  else await all.click()
  await expect(trigger).toHaveText('Todas as UFs')
  await page.getByRole('button', { name: 'Buscar', exact: true }).click()
  const url = new URL(page.url())
  expect(url.searchParams.has('uf')).toBe(false)
  expect(url.searchParams.get('pageSize')).toBe('1')
  expect(url.searchParams.get('page')).toBe('1')
  await expect(page.getByText(/^Página 1 de/)).toBeVisible()
  await expect(page.locator('.person-card')).toHaveCount(1)
  await expect(trigger).toHaveText('Todas as UFs')
})

test('filtro por UF continua enviando o formulário sem JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL })
  try {
    const page = await context.newPage()
    await page.goto('/app')
    await page.getByLabel('Seu estado', { exact: true }).selectOption('SP')
    await page.getByRole('button', { name: 'Encontrar representantes', exact: true }).click()
    await expect(page).toHaveURL(/uf=SP/)
    await expect(page.getByLabel('Unidade federativa')).toHaveValue('SP')
    await page.getByLabel('Unidade federativa').selectOption('')
    await page.getByRole('button', { name: 'Buscar', exact: true }).click()
    expect(new URL(page.url()).searchParams.has('uf')).toBe(false)
    await expect(page.getByLabel('Unidade federativa')).toHaveValue('')
  } finally {
    await context.close()
  }
})

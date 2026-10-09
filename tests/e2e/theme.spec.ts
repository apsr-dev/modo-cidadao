import { expect, test } from '@playwright/test'

test('segue o sistema e preserva a escolha manual após recarga e navegação', async ({
  page,
}, testInfo) => {
  if (testInfo.project.name === 'mobile') await page.setViewportSize({ width: 320, height: 700 })
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  const toggle = page.getByRole('button', { name: 'Tema escuro', exact: true })
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
  await expect(page.locator('html')).toHaveClass('dark')
  const darkSurface = await page
    .locator('body')
    .evaluate((el) => getComputedStyle(el).backgroundColor)
  await page.emulateMedia({ colorScheme: 'light' })
  await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  await expect(page.locator('html')).not.toHaveClass('dark')
  expect(
    await page.locator('body').evaluate((el) => getComputedStyle(el).backgroundColor),
  ).not.toBe(darkSurface)
  // Keyboard activation retains focus and explicitly overrides the system preference.
  await toggle.focus()
  await toggle.press('Space')
  await expect(toggle).toBeFocused()
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  await page.reload()
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('link', { name: 'Encontrar representantes' }).click()
  await expect(page.getByRole('heading', { name: 'Representantes', exact: true })).toBeVisible()
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
  const font = await page.evaluate(async () => {
    await document.fonts.ready
    return document.fonts.check('14px Inter')
  })
  expect(font).toBe(true)
  expect(errors).toEqual([])
})

test('sincroniza a escolha entre abas abertas', async ({ page, context }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  const other = await context.newPage()
  await other.emulateMedia({ colorScheme: 'light' })
  await other.goto('/representantes')
  const toggle = page.getByRole('button', { name: 'Tema escuro', exact: true })
  const otherToggle = other.getByRole('button', { name: 'Tema escuro', exact: true })
  await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  await expect(otherToggle).toHaveAttribute('aria-pressed', 'false')
  await toggle.click()
  await expect(otherToggle).toHaveAttribute('aria-pressed', 'true')
  await otherToggle.click()
  await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  await other.close()
})

test('aplica a escolha salva antes de carregar o JavaScript da aplicação', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('modo-cidadao-theme', 'dark'))
  await page.emulateMedia({ colorScheme: 'light' })
  await page.route('**/assets/*.js', (route) => route.abort())
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /A cidadania continua/ })).toBeVisible()
  await expect(page.locator('html')).toHaveClass('dark')
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#3b82f6')
})

test('permite alternar o tema quando o navegador bloqueia armazenamento', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Storage blocked', 'SecurityError')
      },
    })
  })
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  const toggle = page.getByRole('button', { name: 'Tema escuro', exact: true })
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  await expect(page.locator('html')).not.toHaveClass('dark')
  await page.emulateMedia({ colorScheme: 'light' })
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  await toggle.click()
  await expect(page.locator('html')).toHaveClass('dark')
})

test('mantém contraste legível nos textos e botões das superfícies do tema', async ({ page }) => {
  for (const mode of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: mode })
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Tema escuro', exact: true })).toHaveAttribute(
      'aria-pressed',
      String(mode === 'dark'),
    )
    const samples = await page.evaluate(() => {
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 1
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Canvas unavailable')
      const luminance = (color: string) => {
        context.clearRect(0, 0, 1, 1)
        context.fillStyle = color
        context.fillRect(0, 0, 1, 1)
        const rgb = context.getImageData(0, 0, 1, 1).data
        const linear = (channel: number | undefined) => {
          if (channel === undefined) throw new Error('Invalid RGB sample')
          const value = channel / 255
          return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
        }
        return linear(rgb[0]) * 0.2126 + linear(rgb[1]) * 0.7152 + linear(rgb[2]) * 0.0722
      }
      return [
        '.button-primary',
        '.button-outline',
        '.text-link',
        '.marketing-header nav',
        '.landing-purpose p:not(.section-label)',
        '.landing-path-list p',
        '.principles-list p',
      ].map((selector) => {
        const el = document.querySelector(selector)
        if (!el) throw new Error(`Missing theme sample: ${selector}`)
        const style = getComputedStyle(el)
        let backgroundElement = el
        let background = style.backgroundColor
        while (background === 'rgba(0, 0, 0, 0)' && backgroundElement.parentElement) {
          backgroundElement = backgroundElement.parentElement
          background = getComputedStyle(backgroundElement).backgroundColor
        }
        const foregroundLuminance = luminance(style.color)
        const backgroundLuminance = luminance(background)
        return {
          selector,
          contrast:
            (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
            (Math.min(foregroundLuminance, backgroundLuminance) + 0.05),
        }
      })
    })
    for (const sample of samples) {
      expect(sample.contrast, `${mode}: ${sample.selector}`).toBeGreaterThanOrEqual(4.5)
    }
  }
})

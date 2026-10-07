import type { PersonalDatabase } from '@civica/db'
import { expect, test } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import { requireLocal } from '../../scripts/local-only'

test.skip(process.env.E2E_INTEGRATION !== '1', 'Supabase local opt-in')
test.use({ trace: 'off' })
test('login, follow, reload, isolamento no REST e logout', async ({ page, request }) => {
  const url = requireLocal(process.env.SUPABASE_URL, 'SUPABASE_URL')
  const admin = createClient<PersonalDatabase>(url, process.env.SUPABASE_SECRET_KEY ?? '', {
    auth: { persistSession: false },
  })
  const email = `browser-${crypto.randomUUID()}@example.test`,
    password = `Test-${crypto.randomUUID()}!`
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (error || !data.user) throw new Error('LOCAL_TEST_USER_FAILED')
  const client = createClient<PersonalDatabase>(url, process.env.SUPABASE_PUBLISHABLE_KEY ?? '', {
    auth: { persistSession: false },
  })
  const otherEmail = `other-${crypto.randomUUID()}@example.test`
  const other = await admin.auth.admin.createUser({
    email: otherEmail,
    password,
    email_confirm: true,
  })
  if (other.error || !other.data.user) throw new Error('LOCAL_TEST_USER_FAILED')
  try {
    const catalog = await (await request.get('/api/v1/representatives?pageSize=1')).json()
    const id = catalog.items[0].id
    await page.goto('/meu-brasil')
    await page.getByLabel('E-mail', { exact: true }).fill(email)
    await page.getByLabel('Senha', { exact: true }).fill(password)
    await page.getByRole('button', { name: 'Entrar', exact: true }).click()
    await expect(page.getByText('Sessão iniciada')).toBeVisible()
    await page.goto(`/representantes/${id}`)
    await page.getByRole('button', { name: 'Seguir representante', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Deixar de seguir' })).toBeVisible()
    await page.reload()
    await expect(page.getByRole('button', { name: 'Deixar de seguir' })).toBeVisible()
    const signed = await client.auth.signInWithPassword({ email: otherEmail, password })
    if (signed.error || !signed.data.session) throw new Error('LOCAL_TEST_LOGIN_FAILED')
    const headers = { Authorization: `Bearer ${signed.data.session.access_token}` }
    const isolated = await request.get('/api/v1/me/follows', { headers })
    expect(isolated.status()).toBe(200)
    expect((await isolated.json()).ids).toEqual([])
    await request.delete(`/api/v1/me/follows/people/${id}`, { headers })
    await page.reload()
    await expect(page.getByRole('button', { name: 'Deixar de seguir' })).toBeVisible()
    await page.getByRole('button', { name: 'Deixar de seguir' }).click()
    await expect(
      page.getByRole('button', { name: 'Seguir representante', exact: true }),
    ).toBeVisible()
    await page.goto('/meu-brasil')
    await page.getByRole('button', { name: 'Sair' }).click()
    await expect(page.getByRole('heading', { name: 'Entre na sua conta' })).toBeVisible()
    expect((await page.request.get('/api/v1/me/follows')).status()).toBe(401)
  } finally {
    await client.auth.signOut()
    await admin.auth.admin.deleteUser(data.user.id)
    await admin.auth.admin.deleteUser(other.data.user.id)
  }
})

import type { PersonalDatabase } from '@civica/db'
import { connectDatabase } from '@civica/db'
import { demoPeople } from '@civica/domain'
import { minimizeRaw, normalizeDeputy } from '@civica/source-camara'
import { createClient } from '@supabase/supabase-js'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { requireLocal } from '../../scripts/local-only'
import fixture from '../fixtures/camara-204379.json'

const enabled = process.env.LOCAL_INTEGRATION === '1'
describe.skipIf(!enabled)('PostgreSQL e Auth locais', () => {
  let connection: ReturnType<typeof connectDatabase>
  let reader: ReturnType<typeof connectDatabase>
  let admin: ReturnType<typeof createClient<PersonalDatabase>>
  let a: ReturnType<typeof createClient<PersonalDatabase>>
  let b: ReturnType<typeof createClient<PersonalDatabase>>
  let userA = '',
    userB = ''
  const target = demoPeople[0]?.id ?? ''
  beforeAll(async () => {
    const url = requireLocal(process.env.SUPABASE_URL, 'SUPABASE_URL')
    connection = connectDatabase(requireLocal(process.env.DATABASE_URL, 'DATABASE_URL'))
    reader = connectDatabase(requireLocal(process.env.DATABASE_READ_URL, 'DATABASE_READ_URL'))
    for (const p of demoPeople) await connection.upsertRepresentative(p)
    admin = createClient<PersonalDatabase>(url, process.env.SUPABASE_SECRET_KEY ?? '', {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const password = `Local-Test-${crypto.randomUUID()}!`
    const emailA = `a-${crypto.randomUUID()}@example.test`,
      emailB = `b-${crypto.randomUUID()}@example.test`
    const first = await admin.auth.admin.createUser({
      email: emailA,
      password,
      email_confirm: true,
    })
    if (first.error) throw new Error('LOCAL_AUTH_CREATE_FAILED')
    userA = first.data.user.id
    const second = await admin.auth.admin.createUser({
      email: emailB,
      password,
      email_confirm: true,
    })
    if (second.error) throw new Error('LOCAL_AUTH_CREATE_FAILED')
    userB = second.data.user.id
    a = createClient<PersonalDatabase>(url, process.env.SUPABASE_PUBLISHABLE_KEY ?? '', {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    b = createClient<PersonalDatabase>(url, process.env.SUPABASE_PUBLISHABLE_KEY ?? '', {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    expect((await a.auth.signInWithPassword({ email: emailA, password })).error).toBeNull()
    expect((await b.auth.signInWithPassword({ email: emailB, password })).error).toBeNull()
  })
  afterAll(async () => {
    if (a) await a.auth.signOut()
    if (b) await b.auth.signOut()
    if (userA) await admin.auth.admin.deleteUser(userA)
    if (userB) await admin.auth.admin.deleteUser(userB)
    await connection?.close()
    await reader?.close()
  })
  it('conecta com papel limitado, pagina e preserva idempotência RAW/normalização', async () => {
    const raw = {
      resource: 'deputado',
      externalId: '204379',
      url: 'https://dadosabertos.camara.leg.br/api/v2/deputados/204379',
      fetchedAt: '2026-10-07T13:32:08.298Z',
      ...minimizeRaw(JSON.stringify(fixture), 'deputado'),
    }
    const one = await connection.saveRaw(raw),
      two = await connection.saveRaw(raw)
    expect(one).toBe(two)
    const p = normalizeDeputy(fixture, raw.fetchedAt)
    await connection.upsertRepresentative(p, one)
    await connection.upsertRepresentative(p, two)
    const demo = demoPeople[0]
    if (!demo) throw new Error('DEMO_FIXTURE_MISSING')
    await connection.upsertRepresentative(demo)
    const [before] =
      await connection.client`select count(*)::int as count from civic.party_memberships where mandate_id=${`${demo.id}:camara:demo`}`
    await connection.upsertRepresentative(demo)
    const [after] =
      await connection.client`select count(*)::int as count from civic.party_memberships where mandate_id=${`${demo.id}:camara:demo`}`
    expect(after?.count).toBe(before?.count)
    const result = await reader
      .repository()
      .list({ name: 'acacio', uf: 'AP', page: 1, pageSize: 1 })
    expect(result.total).toBe(1)
    expect(result.items[0]?.id).toBe(p.id)
    const rows =
      await connection.client`select count(*)::int as count from civic.party_memberships where mandate_id=${`${p.id}:camara:${p.legislature}`} and observed_until is null`
    expect(rows[0]?.count).toBe(1)
    await expect(reader.client`select * from internal.raw_snapshots`).rejects.toThrow()
    await expect(reader.client`delete from civic.people where false`).rejects.toThrow()
  })
  it('usuário A segue; B não lê, exclui nem atribui linhas de A; anônimo bloqueado', async () => {
    expect(
      (
        await a
          .from('followed_people')
          .upsert(
            { user_id: userA, person_id: target },
            { onConflict: 'user_id,person_id', ignoreDuplicates: true },
          )
      ).error,
    ).toBeNull()
    expect(
      (
        await a
          .from('followed_people')
          .upsert(
            { user_id: userA, person_id: target },
            { onConflict: 'user_id,person_id', ignoreDuplicates: true },
          )
      ).error,
    ).toBeNull()
    expect((await a.from('followed_people').select('*')).data).toHaveLength(1)
    expect((await b.from('followed_people').select('*').eq('user_id', userA)).data).toEqual([])
    await b.from('followed_people').delete().eq('user_id', userA)
    expect((await a.from('followed_people').select('*')).data).toHaveLength(1)
    expect(
      (
        await b
          .from('followed_people')
          .insert({ user_id: userA, person_id: demoPeople[1]?.id ?? '' })
      ).error,
    ).not.toBeNull()
    expect(
      (await a.from('followed_people').update({ user_id: userB }).eq('user_id', userA)).error,
    ).not.toBeNull()
    const anon = createClient<PersonalDatabase>(
      requireLocal(process.env.SUPABASE_URL, 'SUPABASE_URL'),
      process.env.SUPABASE_PUBLISHABLE_KEY ?? '',
      { auth: { persistSession: false } },
    )
    expect((await anon.from('followed_people').select('*')).error).not.toBeNull()
    expect(
      (await anon.from('followed_people').insert({ user_id: userA, person_id: target })).error,
    ).not.toBeNull()
    const hidden = await fetch(`${process.env.SUPABASE_URL}/rest/v1/raw_snapshots`, {
      headers: { apikey: process.env.SUPABASE_PUBLISHABLE_KEY ?? '', 'Accept-Profile': 'internal' },
    })
    expect(hidden.status).toBe(406)
    expect((await a.from('followed_people').delete().eq('person_id', target)).error).toBeNull()
    expect((await a.from('followed_people').select('*')).data).toEqual([])
  })
})

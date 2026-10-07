import { Button } from '@civica/ui'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { LockKeyhole, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EmptyState } from '../features/shell'
import { metadata } from '../lib/env'
import { getPersonal, login, logout, signup } from '../lib/functions'
export const Route = createFileRoute('/meu-brasil')({
  loader: () => getPersonal(),
  headers: () => ({ 'Cache-Control': 'private, no-store', Vary: 'Cookie, Authorization' }),
  head: () => ({
    ...metadata('Meu Brasil', 'Sua área privada de acompanhamento.', '/meu-brasil'),
    meta: [{ title: 'Meu Brasil' }, { name: 'robots', content: 'noindex, nofollow' }],
  }),
  component: Account,
})
function Account() {
  const session = Route.useLoaderData()
  const router = useRouter()
  const cache = useQueryClient()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [register, setRegister] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  const refresh = async () => {
    await cache.cancelQueries({ queryKey: ['private'] })
    cache.removeQueries({ queryKey: ['private'] })
    await router.invalidate()
  }
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">
          <LockKeyhole size={14} /> UM ESPAÇO SÓ SEU
        </span>
        <h1>Meu Brasil</h1>
        <p>Acompanhe pessoas com privacidade. Seguir alguém não significa apoiar suas posições.</p>
      </div>
      {session.status === 'demo' ? (
        <EmptyState title="Conta indisponível na demonstração">
          <p>
            Login e acompanhamento precisam do Supabase local e de dados integrados. A demonstração
            não cria sessões fictícias nem salva escolhas pessoais.
          </p>
          <Link to="/representantes" search={{ name: '', page: 1, pageSize: 6 }}>
            Explorar a demonstração
          </Link>
        </EmptyState>
      ) : session.status === 'unavailable' ? (
        <EmptyState title="Conta temporariamente indisponível">
          <p>Não foi possível verificar sua sessão. Tente novamente em instantes.</p>
        </EmptyState>
      ) : session.status === 'authenticated' ? (
        <>
          <section className="account-summary">
            <div>
              <strong>Sessão iniciada</strong>
              <p>{session.email}</p>
            </div>
            <Button
              variant="outline"
              disabled={busy || !hydrated}
              onClick={async () => {
                setBusy(true)
                try {
                  await logout()
                  await refresh()
                } catch {
                  setError('Não foi possível encerrar a sessão.')
                } finally {
                  setBusy(false)
                }
              }}
            >
              <LogOut size={16} /> Sair
            </Button>
          </section>
          <section className="panel">
            <h2>Pessoas que você acompanha</h2>
            {session.people.length ? (
              <ul className="follow-list">
                {session.people.map(({ id, name }) => (
                  <li key={id}>
                    <Link to="/representantes/$id" params={{ id }}>
                      {name} →
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                Você ainda não segue ninguém.{' '}
                <Link to="/representantes" search={{ name: '', page: 1, pageSize: 6 }}>
                  Encontre representantes
                </Link>
                .
              </p>
            )}
            <p className="muted">
              Feed, alertas, exportação e exclusão da conta ainda não estão disponíveis nesta
              fundação local.
            </p>
          </section>
        </>
      ) : (
        <section className="auth-panel panel">
          <h2>{register ? 'Criar conta local' : 'Entre na sua conta'}</h2>
          <p>Acesso por e-mail e senha no Supabase configurado para este ambiente.</p>
          <form
            method="post"
            onSubmit={async (event) => {
              event.preventDefault()
              const form = new FormData(event.currentTarget)
              setBusy(true)
              setError('')
              try {
                const input = {
                  email: String(form.get('email')),
                  password: String(form.get('password')),
                }
                if (register) {
                  const result = await signup({ data: input })
                  if (!result.ok) setError('Não foi possível criar a conta. Confira os dados.')
                  else if (!result.confirmed)
                    setError('Confira a confirmação no e-mail do ambiente local.')
                  else await refresh()
                } else {
                  const result = await login({ data: input })
                  if (!result.ok) setError('E-mail ou senha inválidos.')
                  else await refresh()
                }
              } catch {
                setError('Não foi possível acessar a conta. Tente novamente.')
              } finally {
                setBusy(false)
              }
            }}
          >
            <label>
              E-mail
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                disabled={!hydrated}
              />
            </label>
            <label>
              Senha
              <input
                name="password"
                type="password"
                autoComplete={register ? 'new-password' : 'current-password'}
                minLength={10}
                maxLength={128}
                required
                disabled={!hydrated}
              />
            </label>
            <small>No mínimo 10 caracteres. Recuperação de senha ainda não integrada.</small>
            <Button type="submit" disabled={busy || !hydrated}>
              {busy ? 'Aguarde…' : register ? 'Criar conta' : 'Entrar'}
            </Button>
          </form>
          <button
            className="text-link"
            type="button"
            disabled={!hydrated}
            onClick={() => setRegister(!register)}
          >
            {register ? 'Já tenho uma conta' : 'Criar uma conta local'}
          </button>
        </section>
      )}
      {error && (
        <p role="alert" className="error-message">
          {error}
        </p>
      )}
    </>
  )
}

import { Button } from '@civica/ui'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getPersonal, setFollow } from '../lib/functions'
export function FollowButton({ id, demo }: { id: string; demo: boolean }) {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  const cache = useQueryClient()
  const session = useQuery({
    queryKey: ['private', 'session'],
    queryFn: () => getPersonal(),
    enabled: hydrated && !demo,
    staleTime: 0,
  })
  const following = session.data?.ids.includes(id) ?? false
  const mutation = useMutation({
    mutationFn: () => setFollow({ data: { personId: id, follow: !following } }),
    onSuccess: () => cache.invalidateQueries({ queryKey: ['private'] }),
  })
  if (demo)
    return <p className="muted">Seguir está disponível apenas com conta e dados integrados.</p>
  if (session.isPending) return <p>Verificando sua sessão…</p>
  if (session.data?.status === 'anonymous')
    return (
      <Button asChild>
        <Link to="/meu-brasil">Entrar para acompanhar</Link>
      </Button>
    )
  if (session.isError || session.data?.status !== 'authenticated')
    return <p role="status">Acompanhamento indisponível no momento.</p>
  return (
    <div>
      <Button
        type="button"
        variant={following ? 'outline' : 'default'}
        disabled={mutation.isPending}
        onClick={() => mutation.mutate()}
      >
        {mutation.isPending ? 'Salvando…' : following ? 'Deixar de seguir' : 'Seguir representante'}
      </Button>
      {mutation.isError && <p role="alert">Não foi possível salvar. Tente novamente.</p>}
      <small className="follow-hint">Sua escolha é privada e não significa apoio político.</small>
    </div>
  )
}

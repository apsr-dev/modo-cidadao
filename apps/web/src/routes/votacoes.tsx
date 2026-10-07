import { createFileRoute } from '@tanstack/react-router'
import { EmptyState } from '../features/shell'
import { metadata } from '../lib/env'
export const Route = createFileRoute('/votacoes')({
  head: () =>
    metadata(
      'Votações',
      'Decisões parlamentares com objeto, contexto e resultado oficial.',
      '/votacoes',
    ),
  component: Page,
})
function Page() {
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">INFORMAÇÃO PÚBLICA COM CONTEXTO</span>
        <h1>Votações</h1>
        <p>Decisões parlamentares com objeto, contexto e resultado oficial.</p>
      </div>
      <EmptyState title="Integração ainda não disponível">
        <p>
          Esta seção faz parte do planejamento. Ainda não há dados coletados para consulta aqui.
        </p>
        <p>
          Quando a integração estiver disponível, cada registro indicará sua origem, cobertura e
          data de coleta.
        </p>
      </EmptyState>
    </>
  )
}

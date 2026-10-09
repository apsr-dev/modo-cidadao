import { createFileRoute } from '@tanstack/react-router'
import { EmptyState } from '../features/shell'
import { metadata } from '../lib/env'
export const Route = createFileRoute('/_app/propostas')({
  head: () =>
    metadata(
      'Propostas',
      'Textos, versões e tramitações para entender o que está em discussão.',
      '/propostas',
    ),
  component: Page,
})
function Page() {
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">INFORMAÇÃO PÚBLICA COM CONTEXTO</span>
        <h1>Propostas</h1>
        <p>Textos, versões e tramitações para entender o que está em discussão.</p>
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

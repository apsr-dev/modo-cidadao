import { createFileRoute } from '@tanstack/react-router'
import { EmptyState } from '../features/shell'
import { metadata } from '../lib/env'
export const Route = createFileRoute('/_app/eleicoes')({
  head: () =>
    metadata(
      'Eleições',
      'Candidaturas e resultados são registros diferentes. Ambos precisam de fonte e cobertura verificadas.',
      '/eleicoes',
    ),
  component: Page,
})
function Page() {
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">INFORMAÇÃO PÚBLICA COM CONTEXTO</span>
        <h1>Eleições</h1>
        <p>
          Candidaturas e resultados são registros diferentes. Ambos precisam de fonte e cobertura
          verificadas.
        </p>
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

import { Button } from '@civica/ui'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowUpRight, Landmark, MessageSquare } from 'lucide-react'
import { metadata } from '../lib/env'
export const Route = createFileRoute('/participe')({
  head: () =>
    metadata(
      'Participe',
      'Encontre canais oficiais para dialogar, opinar e participar da vida pública.',
      '/participe',
    ),
  component: Participate,
})
function Participate() {
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">SUA VOZ NA VIDA PÚBLICA</span>
        <h1>Participação além do voto.</h1>
        <p>Escolha um canal oficial e veja as orientações da instituição antes de participar.</p>
      </div>
      <div className="participation-grid">
        {[
          {
            title: 'Câmara dos Deputados',
            icon: Landmark,
            desc: 'Encontre enquetes e debates interativos no portal de participação da Câmara.',
            url: 'https://www.camara.leg.br/participe',
          },
          {
            title: 'Senado · e-Cidadania',
            icon: MessageSquare,
            desc: 'Conheça ideias legislativas, consultas públicas e eventos interativos do Senado.',
            url: 'https://www12.senado.leg.br/ecidadania/sobre',
          },
        ].map(({ title, icon: Icon, desc, url }) => (
          <section className="panel" key={url}>
            <span className="icon-tile green">
              <Icon size={26} />
            </span>
            <h2>{title}</h2>
            <p>{desc}</p>
            <Button asChild>
              <a href={url} target="_blank" rel="noreferrer">
                Ir ao canal oficial <ArrowUpRight size={17} />
              </a>
            </Button>
          </section>
        ))}
      </div>
      <section className="provenance">
        <h2>Você participa diretamente no portal oficial.</h2>
        <p>
          Requisitos de acesso, regras e prazos são definidos por cada instituição. Sua conta aqui
          não substitui o acesso ao portal. Não solicitamos senha de gov.br nem enviamos apoios ou
          mensagens automaticamente.
        </p>
        <p>
          São links institucionais gerais. Nenhuma oportunidade específica ou prazo foi importado.
          Uma consulta pública não é uma votação parlamentar.
        </p>
        <p>Referências institucionais verificadas em 7 de outubro de 2026.</p>
      </section>
    </>
  )
}

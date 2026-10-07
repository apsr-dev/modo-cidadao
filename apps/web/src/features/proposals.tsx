import type { ProposalSummary } from '@civica/contracts'
import { authorRole, proposalLabel } from '@civica/domain'
import { Badge } from '@civica/ui'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { valueLabel } from './representatives'

export function sourceDateLabel(value: string) {
  const [date, time] = value.split('T')
  return `${date?.split('-').reverse().join('/')}${time ? ` · ${time} (horário da fonte)` : ''}`
}
export function ProposalCard({
  proposal: p,
  personId,
}: {
  proposal: ProposalSummary
  personId?: string
}) {
  const author = p.authors.find((a) => a.personId === personId)
  return (
    <Link to="/propostas/$id" params={{ id: p.id }} className="proposal-card">
      <div className="proposal-card-heading">
        <Badge>{p.demo ? 'Proposta fictícia' : p.type}</Badge>
        <ArrowUpRight size={19} />
      </div>
      <h2>{proposalLabel(p)}</h2>
      <p className="proposal-ementa">{p.title || 'Ementa não informada pela fonte.'}</p>
      <div className="proposal-card-meta">
        <span>{valueLabel(p.situation)}</span>
        <span>{valueLabel(p.organ)}</span>
      </div>
      {author && <small>{authorRole(author)}</small>}
      <span className="text-link">
        Ver proposta e tramitação <ArrowUpRight size={15} />
      </span>
    </Link>
  )
}

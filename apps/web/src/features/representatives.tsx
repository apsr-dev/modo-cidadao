import type { DataValue, Representative } from '@civica/contracts'
import { Badge } from '@civica/ui'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'

export function valueLabel(value: DataValue) {
  return (
    value.value ??
    {
      not_informed: 'Não informado',
      not_collected: 'Não coletado',
      not_applicable: 'Não se aplica',
    }[value.state as 'not_informed' | 'not_collected' | 'not_applicable'] ??
    'Não informado'
  )
}
export function PersonCard({ person }: { person: Representative }) {
  return (
    <Link to="/representantes/$id" params={{ id: person.id }} className="person-card">
      <span className="avatar" aria-hidden="true">
        {person.name
          .split(' ')
          .slice(0, 2)
          .map((n) => n[0])
          .join('')}
      </span>
      <div className="person-identity">
        <h2>{person.name}</h2>
        <p>{person.demo ? 'Contexto demonstrativo · Câmara' : 'Deputado federal · Câmara'}</p>
      </div>
      <span className="person-party">{valueLabel(person.party)}</span>
      <span className="person-uf">{person.uf}</span>
      <Badge>{person.demo ? 'Personagem fictício' : 'Federal'}</Badge>
      <ArrowUpRight size={18} className="person-arrow" aria-hidden="true" />
    </Link>
  )
}

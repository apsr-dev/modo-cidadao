import type { DataValue, Representative } from '@civica/contracts'
import { Badge } from '@civica/ui'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { representationLabels } from '../lib/catalog-labels'
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
  const representation = representationLabels(person)
  return (
    <Link to="/representantes/$id" params={{ id: person.id }} className="person-card">
      <div className="person-card-top">
        <span className="avatar">
          {person.name
            .split(' ')
            .slice(0, 2)
            .map((n) => n[0])
            .join('')}
        </span>
        <ArrowUpRight size={20} />
      </div>
      <Badge>{person.demo ? 'Personagem fictício' : representation.office}</Badge>
      <h2>{person.name}</h2>
      <p>{valueLabel(person.party)}</p>
      <p className="muted">
        {person.demo
          ? `${representation.office} · Contexto demonstrativo`
          : `Esfera ${representation.sphere.toLocaleLowerCase('pt-BR')} · ${representation.name}`}
      </p>
      <div className="person-card-bottom">
        <span>
          <MapPin size={15} />
          {person.uf}
        </span>
        <span>
          Ver perfil <ArrowUpRight size={14} />
        </span>
      </div>
    </Link>
  )
}

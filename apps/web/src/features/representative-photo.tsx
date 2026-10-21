import type { Representative } from '@civica/contracts'
import { Avatar, AvatarFallback, AvatarImage, cn } from '@civica/ui'
import { representationLabels } from '../lib/catalog-labels'

export function RepresentativePhoto({
  person,
  large = false,
}: {
  person: Representative
  large?: boolean
}) {
  const institution = representationLabels(person).name
  const src = !person.demo && person.photo.state === 'available' ? person.photo.value : undefined
  const initials = person.name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
  return (
    <Avatar className={cn(large && 'large')}>
      {src && (
        <AvatarImage
          src={src}
          alt={`Foto oficial de ${person.name} — ${institution}`}
          title={`Foto: ${institution}`}
          referrerPolicy="no-referrer"
          decoding="async"
        />
      )}
      <AvatarFallback role="img" aria-label={`Representação por iniciais de ${person.name}`}>
        <span aria-hidden="true">{initials}</span>
      </AvatarFallback>
    </Avatar>
  )
}

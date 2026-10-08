import type { Representative } from '@civica/contracts'
import { Avatar, AvatarFallback, AvatarImage, cn } from '@civica/ui'

export function RepresentativePhoto({
  person,
  large = false,
}: {
  person: Representative
  large?: boolean
}) {
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
          alt={`Foto oficial de ${person.name} — Câmara dos Deputados`}
          title="Foto: Câmara dos Deputados"
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

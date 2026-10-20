import type { Representative } from '@civica/contracts'

const institutionLabels: Record<
  Representative['institution'],
  { office: string; sphere: string; name: string }
> = {
  camara: { office: 'Deputado federal', sphere: 'Federal', name: 'Câmara dos Deputados' },
}
export function representationLabels(person: Representative) {
  return institutionLabels[person.institution]
}

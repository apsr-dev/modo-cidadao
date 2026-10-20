import { ufs } from '@civica/contracts'
import {
  NativeSelect,
  NativeSelectOption,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@civica/ui'
import { ClientOnly } from '@tanstack/react-router'
import { useState } from 'react'

type UfSelectProps = {
  id: string
  defaultValue?: (typeof ufs)[number]
  placeholder?: string
}

export function UfSelect({ id, defaultValue, placeholder = 'Todas as UFs' }: UfSelectProps) {
  return (
    <ClientOnly
      fallback={
        <NativeSelect id={id} name="uf" defaultValue={defaultValue ?? ''}>
          <NativeSelectOption value="">{placeholder}</NativeSelectOption>
          {ufs.map((uf) => (
            <NativeSelectOption key={uf} value={uf}>
              {uf}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      }
    >
      <EnhancedUfSelect
        key={defaultValue ?? ''}
        id={id}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </ClientOnly>
  )
}

function EnhancedUfSelect({ id, defaultValue, placeholder }: UfSelectProps) {
  const [value, setValue] = useState<string>(defaultValue ?? '')
  return (
    <>
      <input type="hidden" name="uf" value={value} />
      <Select value={value || 'all'} onValueChange={(next) => setValue(next === 'all' ? '' : next)}>
        <SelectTrigger id={id}>
          <SelectValue>{value || placeholder}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">Todas as UFs</SelectItem>
            {ufs.map((uf) => (
              <SelectItem key={uf} value={uf}>
                {uf}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  )
}

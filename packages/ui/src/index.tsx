import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from './utils'

export { cn } from './utils'

// shadcn/ui Button pattern, adapted to the civic design tokens.
const buttonVariants = cva('button', {
  variants: {
    variant: { default: 'button-primary', outline: 'button-outline', ghost: 'button-ghost' },
  },
  defaultVariants: { variant: 'default' },
})
export function Button({
  className,
  variant,
  asChild = false,
  ...props
}: ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp data-slot="button" className={cn(buttonVariants({ variant }), className)} {...props} />
  )
}
export function Badge({ children, className, ...props }: ComponentProps<'span'>) {
  return (
    <span className={cn('badge', className)} {...props}>
      {children}
    </span>
  )
}

export * from './empty'
export * from './field'
export * from './input'
export * from './native-select'
export * from './separator'

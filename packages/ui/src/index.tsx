import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { type ClassValue, clsx } from 'clsx'
import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
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

// shadcn/ui Avatar composition, using the existing civic avatar styles.
export function Avatar({ className, ...props }: ComponentProps<typeof AvatarPrimitive.Root>) {
  return <AvatarPrimitive.Root data-slot="avatar" className={cn('avatar', className)} {...props} />
}
export function AvatarImage(props: ComponentProps<typeof AvatarPrimitive.Image>) {
  return <AvatarPrimitive.Image data-slot="avatar-image" {...props} />
}
export function AvatarFallback(props: ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return <AvatarPrimitive.Fallback data-slot="avatar-fallback" {...props} />
}

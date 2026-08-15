import { cva, type VariantProps } from 'class-variance-authority'

export { default as Avatar } from './Avatar.vue'
export { default as AvatarImage } from './AvatarImage.vue'
export { default as AvatarFallback } from './AvatarFallback.vue'

export const avatarVariants = cva(
  'inline-flex items-center justify-center font-normal text-foreground select-none shrink-0 bg-secondary overflow-hidden',
  {
    variants: {
      size: {
        sm: 'size-8 text-xs',
        base: 'size-10 text-sm',
        lg: 'size-12 text-base',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-md',
      },
    },
    defaultVariants: {
      size: 'base',
      shape: 'circle',
    },
  },
)

export type AvatarVariants = VariantProps<typeof avatarVariants>

'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { cn } from './cn'

const button = cva(
  'inline-flex items-center justify-center gap-2 rounded-md border font-semibold leading-tight transition-colors disabled:cursor-not-allowed disabled:opacity-40',
  {
    variants: {
      variant: {
        primary: 'border-transparent bg-accent text-accent-ink hover:bg-accent-2',
        secondary: 'border-line-2 bg-surface text-ink hover:border-ink-3',
        ghost: 'border-transparent bg-transparent text-ink-2 hover:text-ink',
        danger: 'border-transparent bg-danger text-white hover:opacity-90',
      },
      size: {
        sm: 'px-3 py-2 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>

export function Button({ className, variant, size, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={cn(button({ variant, size }), className)} {...props} />
}

export type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof button> & { href: string }

/** Même dessin que Button, mais c'est un lien. Un lien navigue, un bouton agit. */
export function ButtonLink({ className, variant, size, href, ...props }: ButtonLinkProps) {
  return (
    <Link href={href} className={cn(button({ variant, size }), className)} {...props} />
  )
}

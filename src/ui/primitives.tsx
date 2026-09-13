import type { CSSProperties, ElementType, ReactNode } from 'react'
import { cn } from './cn'

/*
 * VERROUILLÉ. Les primitives possèdent TOUT l'espacement.
 * Une page ne pose jamais de padding, de margin, ni de media query.
 */

const GAP = {
  xs: 'gap-2',
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
} as const

type Gap = keyof typeof GAP

/** La gouttière latérale et la largeur maximale du site. Définies ici, une fois. */
export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-6xl px-4 md:px-8', className)}>{children}</div>
}

/** Le rythme vertical entre grands blocs. */
export function Section({
  children,
  as: Tag = 'section',
  space = 'md',
  className,
}: {
  children: ReactNode
  as?: ElementType
  space?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const pad = {
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-24',
  }[space]
  return <Tag className={cn(pad, className)}>{children}</Tag>
}

/** Écart vertical entre éléments frères. */
export function Stack({
  children,
  gap = 'md',
  className,
}: {
  children: ReactNode
  gap?: Gap
  className?: string
}) {
  return <div className={cn('flex flex-col', GAP[gap], className)}>{children}</div>
}

/** Horizontal, passe en colonne tout seul quand la place manque. */
export function Row({
  children,
  gap = 'sm',
  align = 'center',
  className,
}: {
  children: ReactNode
  gap?: Gap
  align?: 'start' | 'center' | 'end' | 'baseline'
  className?: string
}) {
  const items = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    baseline: 'items-baseline',
  }[align]
  return <div className={cn('flex flex-wrap', items, GAP[gap], className)}>{children}</div>
}

/** Grille qui se réorganise selon la place. Aucun point de rupture à écrire. */
export function Grid({
  children,
  min = '260px',
  gap = 'md',
  className,
}: {
  children: ReactNode
  min?: string
  gap?: Gap
  className?: string
}) {
  return (
    <div
      className={cn('grid', GAP[gap], className)}
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(min(${min}, 100%), 1fr))` }}
    >
      {children}
    </div>
  )
}

/** Colonne de lecture, bornée à une longueur de ligne confortable. */
export function Prose({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div className={cn('max-w-[58ch]', className)} style={style}>
      {children}
    </div>
  )
}

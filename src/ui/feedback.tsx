import type { ReactNode } from 'react'
import { cn } from './cn'

const TONE = {
  neutral: 'bg-surface-2 text-ink-2',
  accent: 'bg-accent-soft text-accent',
  ok: 'bg-ok-soft text-ok',
  warn: 'bg-warn-soft text-warn',
  danger: 'bg-danger-soft text-danger',
} as const

export type Tone = keyof typeof TONE

/** Étiquette d'état. Jamais décorative : elle dit toujours un statut réel. */
export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold',
        TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/** Message. Le titre dit ce qui s'est passé, le texte dit quoi faire. */
export function Alert({
  title,
  children,
  tone = 'ok',
}: {
  title: string
  children?: ReactNode
  tone?: Exclude<Tone, 'neutral' | 'accent'>
}) {
  return (
    <div className={cn('rounded-md p-4 text-sm', TONE[tone])} role="status">
      <b className="font-semibold">{title}</b> {children}
    </div>
  )
}

/** Surface détachée. À réserver à ce qui est vraiment un objet séparé. */
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-lg border border-line bg-surface p-6', className)}>{children}</div>
  )
}

/** État vide. Dit quoi faire, avec l'action à portée. */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-line-2 p-12 text-center">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg">{title}</h3>
        <p className="text-sm text-ink-3">{description}</p>
      </div>
      {action}
    </div>
  )
}

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'
import { cn } from './cn'

const control =
  'w-full rounded-md border border-line-2 bg-surface px-3 py-3 text-sm text-ink placeholder:text-ink-3 focus-visible:border-accent'

/** Libellé, aide, erreur. Un champ ne s'utilise jamais sans son libellé. */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && !error && <span className="text-xs text-ink-3">{hint}</span>}
      {error && (
        <span className="text-xs text-danger" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

export function Input({
  className,
  invalid,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return <input className={cn(control, invalid && 'border-danger', className)} {...props} />
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(control, className)} {...props}>
      {children}
    </select>
  )
}

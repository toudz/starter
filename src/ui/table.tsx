import type { ReactNode } from 'react'
import { cn } from './cn'

/** Tableau. Toujours dans son propre conteneur scrollable : la page ne scrolle jamais de côté. */
export function Table({ head, children }: { head: ReactNode; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>{head}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function Th({
  children,
  numeric,
}: {
  children: ReactNode
  numeric?: boolean
}) {
  return (
    <th
      className={cn(
        'border-b border-line px-3 py-2 text-left text-xs font-medium text-ink-3',
        numeric && 'text-right',
      )}
    >
      {children}
    </th>
  )
}

export function Td({
  children,
  numeric,
  strong,
}: {
  children: ReactNode
  numeric?: boolean
  strong?: boolean
}) {
  return (
    <td
      className={cn(
        'border-b border-line px-3 py-3 text-ink-2',
        numeric && 'text-right tabular-nums',
        strong && 'font-medium text-ink',
      )}
    >
      {children}
    </td>
  )
}

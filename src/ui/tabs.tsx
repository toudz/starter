'use client'

import { useId, useState, type ReactNode } from 'react'
import { cn } from './cn'

export type Tab = { id: string; label: string; content: ReactNode }

/** Onglets accessibles au clavier (flèches, Début, Fin). */
export function Tabs({ tabs }: { tabs: Tab[] }) {
  const base = useId()
  const [active, setActive] = useState(0)

  function onKey(e: React.KeyboardEvent) {
    const last = tabs.length - 1
    if (e.key === 'ArrowRight') setActive(active === last ? 0 : active + 1)
    else if (e.key === 'ArrowLeft') setActive(active === 0 ? last : active - 1)
    else if (e.key === 'Home') setActive(0)
    else if (e.key === 'End') setActive(last)
    else return
    e.preventDefault()
  }

  return (
    <div className="flex flex-col gap-4">
      <div role="tablist" className="flex gap-6 border-b border-line" onKeyDown={onKey}>
        {tabs.map((t, i) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`${base}-${t.id}`}
            aria-selected={i === active}
            aria-controls={`${base}-${t.id}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={cn(
              '-mb-px border-b-2 py-3 text-sm font-medium transition-colors',
              i === active
                ? 'border-accent text-ink'
                : 'border-transparent text-ink-3 hover:text-ink',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${base}-${tabs[active].id}-panel`}
        aria-labelledby={`${base}-${tabs[active].id}`}
        className="text-sm text-ink-2"
      >
        {tabs[active].content}
      </div>
    </div>
  )
}

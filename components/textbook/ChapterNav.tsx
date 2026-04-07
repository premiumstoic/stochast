import Link from 'next/link'
import type { ChapterMeta } from '@/lib/chapters'

interface Props {
  prev: ChapterMeta | null
  next: ChapterMeta | null
}

export function ChapterNav({ prev, next }: Props) {
  return (
    <nav className="flex justify-between items-center mt-16 pt-6 border-t border-border">
      {prev ? (
        <Link
          href={`/${prev.slug}`}
          className="flex flex-col gap-1 text-left group"
        >
          <span className="text-xs font-mono text-text-muted uppercase tracking-widest">Previous</span>
          <span className="text-sm font-mono text-text-primary group-hover:text-accent-primary transition-colors">
            ← {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/${next.slug}`}
          className="flex flex-col gap-1 text-right group"
        >
          <span className="text-xs font-mono text-text-muted uppercase tracking-widest">Next</span>
          <span className="text-sm font-mono text-text-primary group-hover:text-accent-primary transition-colors">
            {next.title} →
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  )
}

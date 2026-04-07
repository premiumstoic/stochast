import Link from 'next/link'
import { chapters } from '@/lib/chapters'
import { ThemeButton } from '@/components/ThemeButton'

export default function TextbookIndexPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)', color: 'var(--color-text-primary)' }}>
      <header className="border-b border-border px-4 py-3 flex items-center justify-between md:px-6">
        <span className="text-sm font-mono text-text-primary">stochast</span>
        <div className="flex items-center gap-2">
          <ThemeButton />
          <Link
            href="/sandbox"
            className="text-xs font-mono text-text-muted hover:text-accent-primary transition-colors border border-border px-3 py-1 hover:border-accent-primary"
          >
            sandbox →
          </Link>
        </div>
      </header>

      <main id="main-content" className="max-w-2xl mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="mb-12">
          <h1 className="text-3xl font-mono font-semibold text-text-primary mb-3">Stochast</h1>
          <p className="font-sans text-text-muted leading-relaxed" style={{ fontFamily: 'var(--font-ibm-plex-sans)' }}>
            A browser-based textbook on stochastic processes. Three guided chapters introduce
            the launch rules, then the final handoff opens the full sandbox for free-form exploration.
          </p>
        </div>

        <nav aria-label="Textbook chapters">
          <ol className="space-y-0">
            {chapters.map((chapter, idx) => (
              <li key={chapter.slug}>
                <Link
                  href={`/${chapter.slug}`}
                  className="flex items-start gap-4 py-4 border-t border-border group hover:border-accent-primary transition-colors"
                >
                  <span className="text-xs font-mono text-text-muted pt-0.5 w-4 shrink-0 tabular-nums">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-mono text-text-primary group-hover:text-accent-primary transition-colors">
                      {chapter.title}
                    </div>
                    <div
                      className="text-sm text-text-muted mt-0.5"
                      style={{ fontFamily: 'var(--font-ibm-plex-sans)' }}
                    >
                      {chapter.description}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
            {/* Last border */}
            <li className="border-t border-border" />
          </ol>
        </nav>
      </main>
    </div>
  )
}

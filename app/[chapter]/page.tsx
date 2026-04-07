import Link from 'next/link'
import { notFound } from 'next/navigation'
import { readFile } from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { chapters, getAdjacentChapters } from '@/lib/chapters'
import { SimulationWidget } from '@/components/textbook/SimulationWidget'
import { ChapterNav } from '@/components/textbook/ChapterNav'
import { ThemeButton } from '@/components/ThemeButton'

export async function generateStaticParams() {
  return chapters.map((c) => ({ chapter: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter } = await params
  const meta = chapters.find((c) => c.slug === chapter)
  if (!meta) return {}
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: `${meta.title} | Stochast`,
      description: meta.description,
      type: 'article',
      url: `https://stochast.vercel.app/${meta.slug}`,
    },
  }
}

const mdxComponents = {
  SimulationWidget,
}

export default async function ChapterPage({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter } = await params
  const meta = chapters.find((c) => c.slug === chapter)
  if (!meta) notFound()

  const filePath = path.join(process.cwd(), 'content', 'textbook', `${chapter}.mdx`)
  let raw: string
  try {
    raw = await readFile(filePath, 'utf-8')
  } catch {
    notFound()
  }

  const { content } = matter(raw)
  const { prev, next } = getAdjacentChapters(chapter)
  const currentIndex = chapters.findIndex((entry) => entry.slug === chapter)

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)', color: 'var(--color-text-primary)' }}>
      <header className="border-b border-border px-4 py-3 flex items-center justify-between md:px-6">
        <Link href="/" className="text-sm font-mono text-text-muted hover:text-text-primary transition-colors">
          stochast
        </Link>
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

      <main
        id="main-content"
        className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:px-6 md:py-12 lg:grid-cols-[14rem_minmax(0,42rem)]"
      >
        <aside className="hidden lg:block">
          <div className="sticky top-8 border border-border bg-surface">
            <div className="border-b border-border px-4 py-3">
              <div className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
                Chapter Progress
              </div>
              <div className="mt-1 text-sm font-mono text-text-primary">
                {String(currentIndex + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}
              </div>
            </div>
            <nav aria-label="Chapter progress" className="p-2">
              {chapters.map((entry, index) => {
                const isCurrent = entry.slug === chapter
                return (
                  <Link
                    key={entry.slug}
                    href={`/${entry.slug}`}
                    className={[
                      'block border px-3 py-2 text-sm font-mono transition-colors',
                      index > 0 ? 'mt-2' : '',
                      isCurrent
                        ? 'border-accent-primary text-accent-primary'
                        : 'border-border text-text-muted hover:border-accent-primary hover:text-accent-primary',
                    ].join(' ')}
                  >
                    {String(index + 1).padStart(2, '0')} {entry.title}
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-8 border border-border bg-surface px-4 py-3 lg:hidden">
            <div className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
              Chapter Progress
            </div>
            <div className="mt-1 text-sm font-mono text-text-primary">
              {String(currentIndex + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')} · {meta.title}
            </div>
          </div>

          <div className="prose-chapter">
            <MDXRemote source={content} components={mdxComponents} />
          </div>
          <ChapterNav prev={prev} next={next} />
        </div>
      </main>
    </div>
  )
}

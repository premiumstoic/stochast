import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapters, getAdjacentChapters } from '@/lib/chapters'

describe('route and content smoke tests', () => {
  it('locks the textbook progression to the documented launch sequence', () => {
    expect(chapters.map((chapter) => chapter.slug)).toEqual([
      'gaussian-baseline',
      'uniform-memory',
      'positive-feedback',
      'open-sandbox',
    ])
  })

  it('keeps textbook content files in sync with the chapter route map', () => {
    const contentDir = path.join(process.cwd(), 'content', 'textbook')
    const contentSlugs = fs
      .readdirSync(contentDir)
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => file.replace(/\.mdx$/, ''))
      .sort()

    const chapterSlugs = chapters.map((chapter) => chapter.slug).sort()
    expect(contentSlugs).toEqual(chapterSlugs)
  })

  it('keeps chapter adjacency aligned to the declared route order', () => {
    chapters.forEach((chapter, index) => {
      const { prev, next } = getAdjacentChapters(chapter.slug)
      expect(prev?.slug ?? null).toBe(chapters[index - 1]?.slug ?? null)
      expect(next?.slug ?? null).toBe(chapters[index + 1]?.slug ?? null)
    })
  })

  it('publishes sandbox metadata for the interactive route', () => {
    const sandboxPage = fs.readFileSync(path.join(process.cwd(), 'app', 'sandbox', 'page.tsx'), 'utf8')
    expect(sandboxPage).toContain("title: 'Sandbox'")
    expect(sandboxPage).toContain('stochastic rules')
    expect(sandboxPage).toContain('https://stochast.vercel.app/sandbox')
  })

  it('keeps the final textbook handoff pointed at the sandbox with a preset carryover', () => {
    const handoffChapter = fs.readFileSync(
      path.join(process.cwd(), 'content', 'textbook', 'open-sandbox.mdx'),
      'utf8',
    )

    expect(handoffChapter).toContain('/sandbox?preset=positive-feedback')
    expect(handoffChapter).toContain('Open the full sandbox')
  })
})

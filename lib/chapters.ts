export interface ChapterMeta {
  slug: string
  order: number
  title: string
  description: string
}

export const chapters: ChapterMeta[] = [
  {
    slug: 'gaussian-baseline',
    order: 1,
    title: 'Gaussian Baseline',
    description: 'A constant rule produces the bell-curve baseline.',
  },
  {
    slug: 'uniform-memory',
    order: 2,
    title: 'Uniform Memory',
    description: 'Path dependence turns the bell curve into a flat distribution.',
  },
  {
    slug: 'positive-feedback',
    order: 3,
    title: 'Positive-Feedback S-Curve',
    description: 'Nonlinear reinforcement pushes trajectories to the edges.',
  },
  {
    slug: 'open-sandbox',
    order: 4,
    title: 'Open Sandbox',
    description: 'Take the training wheels off and explore your own formulas.',
  },
]

export function getChapterBySlug(slug: string): ChapterMeta | undefined {
  return chapters.find((c) => c.slug === slug)
}

export function getAdjacentChapters(slug: string): {
  prev: ChapterMeta | null
  next: ChapterMeta | null
} {
  const idx = chapters.findIndex((c) => c.slug === slug)
  return {
    prev: idx > 0 ? chapters[idx - 1] : null,
    next: idx < chapters.length - 1 ? chapters[idx + 1] : null,
  }
}

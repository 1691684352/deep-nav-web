import DOMPurify from 'isomorphic-dompurify'
import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: false })

/** Renders untrusted markdown (tool overviews, submissions) into safe HTML. */
export function renderMarkdown(source: string): string {
  if (!source) return ''
  const html = marked.parse(source, { async: false }) as string
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })
}

/** Placeholder the overview uses to position the feature grid. */
export const FEATURE_SLOT = '<!-- features -->'

export function splitOverview(source: string): [string, string] {
  const index = source.indexOf(FEATURE_SLOT)
  if (index === -1) return [source, '']
  return [source.slice(0, index), source.slice(index + FEATURE_SLOT.length)]
}

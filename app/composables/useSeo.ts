import type { SeoMeta } from '#shared/types'

/** Used whenever a page does not provide its own social preview image. */
const DEFAULT_OG_IMAGE = '/assets/deepseek-site-preview.png'

/**
 * Applies backend-provided SEO metadata. Every page passes the `seo` object it
 * receives from the API so titles, descriptions and OG tags stay configurable.
 */
export function useSeoFromApi(meta: MaybeRefOrGetter<SeoMeta | null | undefined>) {
  const config = useRuntimeConfig()
  const route = useRoute()
  const siteUrl = config.public.siteUrl as string

  const resolved = computed(() => toValue(meta))

  const canonical = computed(() => {
    const path = resolved.value?.canonical ?? route.path
    return path.startsWith('http') ? path : `${siteUrl.replace(/\/$/, '')}${path}`
  })

  const image = computed(() => {
    const src = resolved.value?.ogImage ?? DEFAULT_OG_IMAGE
    return src.startsWith('http') ? src : `${siteUrl.replace(/\/$/, '')}${src}`
  })

  useSeoMeta({
    title: () => resolved.value?.title ?? '深度指引',
    description: () => resolved.value?.description,
    robots: () => resolved.value?.robots ?? 'index, follow',
    ogTitle: () => resolved.value?.ogTitle ?? resolved.value?.title,
    ogDescription: () => resolved.value?.ogDescription ?? resolved.value?.description,
    ogType: () => (resolved.value?.ogType ?? 'website') as 'website',
    ogUrl: () => canonical.value,
    ogImage: () => image.value,
    ogSiteName: '深度指引',
    ogLocale: 'zh_CN',
    twitterCard: 'summary_large_image',
    twitterTitle: () => resolved.value?.ogTitle ?? resolved.value?.title,
    twitterDescription: () => resolved.value?.ogDescription ?? resolved.value?.description,
    twitterImage: () => image.value,
  })

  useHead({
    meta: [{ name: 'keywords', content: () => resolved.value?.keywords ?? '' }],
    link: [{ rel: 'canonical', href: canonical }],
  })
}

/** Resolves a path/URL to an absolute URL using the configured site origin. */
export function useAbsoluteUrl() {
  const config = useRuntimeConfig()
  const origin = (config.public.siteUrl as string).replace(/\/$/, '')
  return (path?: string) => {
    if (!path) return origin
    return path.startsWith('http') ? path : `${origin}${path.startsWith('/') ? '' : '/'}${path}`
  }
}

/**
 * Injects a reactive JSON-LD (schema.org) block into the document head.
 * `id` keeps the script deduped/replaceable across navigations.
 */
export function useJsonLd(id: string, data: MaybeRefOrGetter<Record<string, unknown> | null | undefined>) {
  useHead({
    script: [{
      key: `ld-${id}`,
      type: 'application/ld+json',
      innerHTML: () => {
        const value = toValue(data)
        return value ? JSON.stringify(value) : ''
      },
    }],
  })
}

import { staticPageBySlug, staticPages } from '../../data/pages'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug') ?? 'index'
  const page = staticPageBySlug.get(slug)
  if (!page) {
    throw createError({ statusCode: 404, statusMessage: '页面不存在' })
  }

  return ok({
    seo: {
      title: `${page.title} - 深度指引`,
      description: page.description,
      keywords: [page.title, '深度指引'].join(','),
      canonical: slug === 'index' ? '/about' : `/about/${slug}`,
    },
    page,
    nav: staticPages.map(item => ({
      slug: item.slug,
      title: item.title,
      to: item.slug === 'index' ? '/about' : `/about/${item.slug}`,
    })),
  })
})

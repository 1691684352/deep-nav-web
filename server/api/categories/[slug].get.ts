import { seoPresets } from '../../data/site'
import { categoryBySlug } from '../../data/taxonomy'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug') ?? 'all'
  const category = categoryBySlug.get(slug)
  if (!category) {
    throw createError({ statusCode: 404, statusMessage: '分类不存在' })
  }

  const all = categoriesWithCounts()
  const current = all.find(item => item.slug === slug)!
  const groups = categoryGroups(slug, 12)

  return ok({
    seo: {
      ...seoPresets.category,
      title: slug === 'all'
        ? seoPresets.category!.title
        : `${category.label} - 分类导航 - 深度指引`,
      description: `${category.description}。深度指引已收录 ${current.toolCount} 个${category.label}相关工具。`,
      canonical: `/category/${slug}`,
    },
    category: current,
    categories: all,
    navCategories: navCategoriesWithCounts(),
    groups,
    hotTools: categoryTools(slug).slice(0, 6),
    total: current.toolCount,
  })
})

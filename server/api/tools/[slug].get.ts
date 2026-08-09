export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const detail = buildToolDetail(slug)
  if (!detail) {
    throw createError({ statusCode: 404, statusMessage: '工具不存在' })
  }

  return ok({
    seo: {
      title: `${detail.name} - ${detail.slogan} - 深度指引`,
      description: `${detail.name}：${detail.desc}。${detail.slogan}。查看功能介绍、用户评分与同类工具推荐。`,
      keywords: [detail.name, detail.category, detail.navCategory, ...detail.siteTags].join(','),
      ogType: 'article',
      ogImage: detail.gallery?.main.src ?? '/assets/deepseek-site-preview.png',
      canonical: `/tool/${detail.slug}`,
    },
    detail,
  })
})

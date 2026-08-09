import type { Review } from '#shared/types'

interface ReviewBody {
  rating?: number
  content?: string
  author?: string
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  if (!findTool(slug)) {
    throw createError({ statusCode: 404, statusMessage: '工具不存在' })
  }

  const body = await readBody<ReviewBody>(event)
  const rating = Math.round(Number(body?.rating ?? 0))
  const content = (body?.content ?? '').trim()

  if (rating < 1 || rating > 5) {
    throw createError({ statusCode: 422, statusMessage: '请先选择 1-5 星评分' })
  }
  if (content.length < 5) {
    throw createError({ statusCode: 422, statusMessage: '评价内容至少需要 5 个字' })
  }

  const author = (body?.author ?? '深度用户').trim() || '深度用户'
  const review: Review = {
    id: `review-${Date.now()}`,
    toolSlug: slug,
    author,
    avatarText: author.slice(0, 1).toUpperCase(),
    rating,
    content: content.slice(0, 500),
    createdAt: new Date().toISOString(),
    likes: 0,
  }

  return ok(review, '评价发布成功')
})

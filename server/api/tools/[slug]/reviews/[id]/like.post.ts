export default defineEventHandler((event) => {
  const account = requireAccount(event)
  const slug = getRouterParam(event, 'slug') ?? ''
  const id = getRouterParam(event, 'id') ?? ''
  if (!findTool(slug)) throw createError({ statusCode: 404, statusMessage: '工具不存在' })
  return ok({ likes: likeReview(id, slug, account.user.id) }, '已点赞')
})

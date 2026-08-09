export default defineEventHandler((event) => {
  const account = requireAccount(event)
  const slug = getRouterParam(event, 'slug') ?? ''
  return ok(removeFavoriteRecord(account, slug), '已取消收藏')
})

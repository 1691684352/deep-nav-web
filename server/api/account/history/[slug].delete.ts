export default defineEventHandler((event) => {
  const account = requireAccount(event)
  const slug = getRouterParam(event, 'slug') ?? ''
  return ok(removeHistoryRecord(account, slug), '已移除浏览记录')
})

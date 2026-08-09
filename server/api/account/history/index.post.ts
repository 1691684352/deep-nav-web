export default defineEventHandler(async (event) => {
  const account = requireAccount(event)
  const body = await readBody<{ toolSlug?: string }>(event)
  const tool = findTool(body?.toolSlug ?? '')
  if (!tool) {
    throw createError({ statusCode: 404, statusMessage: '工具不存在' })
  }
  return ok(recordHistoryItem(account, {
    toolSlug: tool.slug,
    name: tool.name,
    desc: tool.desc,
    domain: tool.domain,
    url: tool.url,
    category: tool.category,
    visitedAt: '',
  }), '浏览记录已更新')
})

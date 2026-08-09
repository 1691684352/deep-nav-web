import { siteConfig } from '../../data/site'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const keyword = toStringParam(query.keyword ?? query.q)
  const limit = toNumber(query.limit, 6)

  return ok({
    keyword,
    tools: suggestTools(keyword, limit),
    keywords: siteConfig.globalSearchKeywords,
  })
})

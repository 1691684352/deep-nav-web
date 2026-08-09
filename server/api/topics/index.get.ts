import { seoPresets } from '../../data/site'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const keyword = toStringParam(query.keyword)
  const page = toNumber(query.page, 1)
  const pageSize = toNumber(query.pageSize, 12)

  return ok({
    seo: { ...seoPresets.topic, canonical: '/topic' },
    keyword,
    result: paginate(listTopics(keyword), page, pageSize),
  })
})

import type { User } from '#shared/types'

export default defineEventHandler(async (event) => {
  const account = requireAccount(event)
  const body = await readBody<Partial<Pick<User, 'nickname' | 'bio' | 'location'>>>(event)
  const nickname = (body?.nickname ?? '').trim()
  const bio = (body?.bio ?? '').trim()
  const location = (body?.location ?? '').trim()
  if (nickname.length < 2 || nickname.length > 24) {
    throw createError({ statusCode: 422, statusMessage: '昵称需为 2-24 个字符' })
  }
  if (bio.length > 120 || location.length > 40) {
    throw createError({ statusCode: 422, statusMessage: '资料内容超过长度限制' })
  }
  return ok(replaceUser(account, { nickname, bio, location }), '资料已更新')
})

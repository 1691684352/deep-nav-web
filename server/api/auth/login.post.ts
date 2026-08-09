import type { AuthSession } from '#shared/types'
import { defaultFavorites, defaultHistory, defaultSubmissions, demoUser } from '../../data/account'

const phonePattern = /^1[3-9]\d{9}$/

/** Demo credential accepted by the mock backend. */
const DEMO_CODE = '123456'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ phone?: string, code?: string }>(event)
  const phone = (body?.phone ?? '').trim()
  const code = (body?.code ?? '').trim()

  if (!phonePattern.test(phone)) {
    throw createError({ statusCode: 422, statusMessage: '请输入正确的 11 位手机号' })
  }
  if (!/^\d{6}$/.test(code)) {
    throw createError({ statusCode: 422, statusMessage: '请输入 6 位验证码' })
  }
  if (code !== DEMO_CODE) {
    throw createError({ statusCode: 401, statusMessage: '验证码不正确，演示环境请输入 123456' })
  }

  const masked = `${phone.slice(0, 3)}****${phone.slice(-4)}`
  const session: AuthSession = {
    token: `mock-token-${Date.now()}`,
    user: { ...demoUser, phone: masked },
  }

  return ok({
    session,
    favorites: defaultFavorites,
    history: defaultHistory,
    submissions: defaultSubmissions,
  }, '登录成功')
})

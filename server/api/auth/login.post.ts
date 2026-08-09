const phonePattern = /^1[3-9]\d{9}$/

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
  verifyCode(phone, code)

  return ok(createSession(event, phone), '登录成功')
})

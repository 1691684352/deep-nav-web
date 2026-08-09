const phonePattern = /^1[3-9]\d{9}$/

export default defineEventHandler(async (event) => {
  const body = await readBody<{ phone?: string }>(event)
  const phone = (body?.phone ?? '').trim()

  if (!phonePattern.test(phone)) {
    throw createError({ statusCode: 422, statusMessage: '请输入正确的 11 位手机号' })
  }

  return ok({ phone, ...issueVerificationCode(phone) }, '验证码已发送')
})

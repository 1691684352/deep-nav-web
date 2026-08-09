const DEMO_CODE = '123456'
const CODE_TTL = 5 * 60 * 1000
const RESEND_INTERVAL = 60 * 1000
const MAX_ATTEMPTS = 5

interface VerificationRecord {
  code: string
  expiresAt: number
  sentAt: number
  attempts: number
}

const verificationCodes = new Map<string, VerificationRecord>()

export function issueVerificationCode(phone: string) {
  const now = Date.now()
  const current = verificationCodes.get(phone)
  if (current && now - current.sentAt < RESEND_INTERVAL) {
    throw createError({ statusCode: 429, statusMessage: '验证码发送过于频繁，请稍后再试' })
  }
  verificationCodes.set(phone, {
    code: DEMO_CODE,
    expiresAt: now + CODE_TTL,
    sentAt: now,
    attempts: 0,
  })
  return {
    expiresIn: CODE_TTL / 1000,
    resendIn: RESEND_INTERVAL / 1000,
    hint: `演示环境验证码为 ${DEMO_CODE}`,
  }
}

export function verifyCode(phone: string, code: string) {
  const record = verificationCodes.get(phone)
  if (!record) throw createError({ statusCode: 401, statusMessage: '请先获取验证码' })
  if (record.expiresAt <= Date.now()) {
    verificationCodes.delete(phone)
    throw createError({ statusCode: 401, statusMessage: '验证码已过期，请重新获取' })
  }
  if (record.attempts >= MAX_ATTEMPTS) {
    verificationCodes.delete(phone)
    throw createError({ statusCode: 429, statusMessage: '验证码错误次数过多，请重新获取' })
  }
  if (record.code !== code) {
    record.attempts += 1
    throw createError({ statusCode: 401, statusMessage: '验证码不正确' })
  }
  verificationCodes.delete(phone)
}

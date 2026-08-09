import type { FeedbackForm, FeedbackRecord } from '#shared/types'
import { formatDateTime } from '#shared/utils'
import { feedbackOptions } from '../../data/feedback'

export default defineEventHandler(async (event) => {
  const account = requireAccount(event)
  const body = await readBody<Partial<FeedbackForm>>(event)
  const content = (body?.content ?? '').trim()
  const contact = (body?.contact ?? '').trim()
  const type = body?.type ?? 'suggestion'
  if (!feedbackOptions.types.some(item => item.value === type)) {
    throw createError({ statusCode: 422, statusMessage: '请选择正确的反馈类型' })
  }
  if (content.length < 10 || content.length > 1000) {
    throw createError({ statusCode: 422, statusMessage: '反馈内容需为 10-1000 个字符' })
  }
  if (contact.length > 100) {
    throw createError({ statusCode: 422, statusMessage: '联系方式不能超过 100 个字符' })
  }
  const feedback: FeedbackRecord = {
    id: `feedback-${Date.now()}`,
    type,
    content,
    contact,
    status: 'received',
    statusLabel: '已收到',
    submittedAt: formatDateTime(new Date()),
  }
  return ok(saveFeedbackRecord(account, feedback), '反馈提交成功，感谢你的建议')
})

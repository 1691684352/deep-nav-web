import type { Submission, SubmissionForm } from '#shared/types'
import { formatDateTime } from '#shared/utils'
import { validateSubmission } from '#shared/utils/validation'
import { submissionStatusLabels } from '../../data/account'
import { categoryBySlug } from '../../data/taxonomy'

export default defineEventHandler(async (event) => {
  const account = requireAccount(event)
  const body = await readBody<Partial<SubmissionForm>>(event)
  const errors = validateSubmission(body ?? {})

  if (Object.keys(errors).length) {
    throw createError({
      statusCode: 422,
      statusMessage: '表单校验未通过',
      data: { errors },
    })
  }

  const form = body as SubmissionForm
  const category = categoryBySlug.get(form.categorySlug)
  const now = formatDateTime(new Date())

  const submission: Submission = {
    ...form,
    name: form.name.trim(),
    url: form.url.trim(),
    slogan: form.slogan.trim(),
    description: form.description.trim(),
    tags: form.tags.slice(0, 10),
    id: `submission-${Date.now()}`,
    status: 'review',
    statusLabel: submissionStatusLabels.review,
    category: category?.name ?? '其他',
    submittedAt: now,
    updatedAt: now,
  }

  saveSubmissionRecord(account, submission)
  return ok(submission, '提交成功，我们会在 1-3 个工作日内完成审核')
})

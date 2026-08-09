import type { SubmissionDraft } from '#shared/types'

export default defineEventHandler(async (event) => {
  const account = requireAccount(event)
  const draft = await readBody<SubmissionDraft>(event)
  return ok(saveDraftRecord(account, draft), '草稿已保存')
})

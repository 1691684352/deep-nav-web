import type { SubmissionForm } from '../types'

export type SubmissionErrors = Partial<Record<keyof SubmissionForm, string>>

/** Fields validated in each wizard step, used by both the form and the API. */
export const submissionStepFields: Array<Array<keyof SubmissionForm>> = [
  ['name', 'url', 'icon', 'categorySlug', 'language', 'slogan'],
  ['description', 'tags'],
  ['contactName', 'contactEmail', 'agreement'],
]

const urlPattern = /^https?:\/\/[\w-]+(\.[\w-]+)+([\w\-.,@?^=%&:/~+#]*)?$/i
const emailPattern = /^[\w.!#$%&'*+/=?^`{|}~-]+@[\w-]+(\.[\w-]+)+$/

export function validateSubmission(form: Partial<SubmissionForm>): SubmissionErrors {
  const errors: SubmissionErrors = {}
  const name = (form.name ?? '').trim()
  const url = (form.url ?? '').trim()
  const slogan = (form.slogan ?? '').trim()
  const description = (form.description ?? '').trim()
  const contactName = (form.contactName ?? '').trim()
  const contactEmail = (form.contactEmail ?? '').trim()
  const tags = form.tags ?? []

  if (name.length < 2 || name.length > 50) errors.name = '网站名称需为 2-50 个字符'
  if (!urlPattern.test(url)) errors.url = '请输入包含 http:// 或 https:// 的完整地址'
  if (!form.categorySlug) errors.categorySlug = '请选择网站分类'
  if (!form.language) errors.language = '请选择网站语言'
  if (slogan.length < 10 || slogan.length > 60) errors.slogan = '一句话描述需为 10-60 个字符'
  if (description.length < 30) errors.description = '网站描述至少需要 30 个字符'
  if (tags.length < 1) errors.tags = '至少添加 1 个标签'
  if (tags.length > 10) errors.tags = '最多添加 10 个标签'
  if (contactName.length < 2) errors.contactName = '请填写联系人称呼'
  if (!emailPattern.test(contactEmail)) errors.contactEmail = '请输入有效的邮箱地址'
  if (!form.agreement) errors.agreement = '请先阅读并同意收录协议'

  return errors
}

export function validateSubmissionStep(form: Partial<SubmissionForm>, step: number): SubmissionErrors {
  const fields = submissionStepFields[step - 1] ?? []
  const all = validateSubmission(form)
  const scoped: SubmissionErrors = {}
  for (const field of fields) {
    if (all[field]) scoped[field] = all[field]
  }
  return scoped
}

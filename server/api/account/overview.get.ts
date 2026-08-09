import { profileNavItems, submissionStatusFilters } from '../../data/account'
import { seoPresets } from '../../data/site'

export default defineEventHandler((event) => {
  const account = accountSnapshot(event)
  return ok({
    seo: { ...seoPresets.profile, canonical: '/profile' },
    navItems: profileNavItems,
    statusFilters: submissionStatusFilters,
    messages: buildMessages(account.submissions),
    ...account,
  })
})

function buildMessages(submissions: ReturnType<typeof accountSnapshot>['submissions']) {
  const statusIcon = {
    review: 'clock-3',
    approved: 'circle-check',
    rejected: 'circle-x',
  }
  return submissions.map(item => ({
    id: item.id,
    icon: statusIcon[item.status],
    status: item.status,
    title: item.status === 'review'
      ? `「${item.name}」已进入审核队列`
      : item.status === 'approved'
        ? `「${item.name}」已通过审核`
        : `「${item.name}」未通过审核`,
    body: item.status === 'approved'
      ? '网站已展示在对应分类中，感谢你的贡献。'
      : item.status === 'rejected'
        ? '内容与现有收录重复或信息不完整，欢迎补充后再次提交。'
        : '我们会在 1-3 个工作日内完成审核，结果将通过站内消息通知。',
    time: item.updatedAt,
  }))
}

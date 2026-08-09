import type { FeedbackOptionsPayload } from '#shared/types'
import { seoPresets } from './site'

export const feedbackOptions: FeedbackOptionsPayload = {
  seo: {
    ...seoPresets.profile,
    title: '建议反馈 - 深度指引',
    description: '向深度指引提交产品建议、问题反馈或内容纠错。',
    canonical: '/feedback',
    robots: 'noindex, follow',
  },
  types: [
    { value: 'suggestion', label: '产品建议' },
    { value: 'bug', label: '功能问题' },
    { value: 'content', label: '内容纠错' },
    { value: 'other', label: '其他反馈' },
  ],
  contactPlaceholder: '选填，邮箱或微信，方便我们联系你',
  contentPlaceholder: '请描述你遇到的问题、建议或需要纠正的内容',
  notices: [
    '请尽量描述复现步骤、使用设备和浏览器版本。',
    '内容纠错请附上对应页面地址或工具名称。',
    '我们通常会在 1-3 个工作日内查看反馈。',
  ],
}

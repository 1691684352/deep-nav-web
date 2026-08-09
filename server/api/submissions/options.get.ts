import { seoPresets } from '../../data/site'
import { categories, navCategories } from '../../data/taxonomy'

/** Suggested tags surfaced under the tag input. */
const suggestedTags = ['AI', '大语言模型', '人工智能', '对话助手', '效率工具', '设计资源', '开发工具', '数据分析', '免费使用', '在线工具']

export default defineEventHandler(() => ok({
  seo: { ...seoPresets.submit, canonical: '/submit' },
  categories: categories.filter(item => item.slug !== 'all'),
  navCategories,
  languages: ['中文', '英文', '多语言'],
  suggestedTags,
  steps: [
    { step: 1, title: '基本信息', hint: '填写网站基本信息' },
    { step: 2, title: '网站详情', hint: '补充网站详细信息' },
    { step: 3, title: '提交审核', hint: '确认并提交审核' },
  ],
  notices: [
    '请确保提交的网站内容合法合规，且对用户有实际价值。',
    '网站必须能够正常访问，且内容完整。',
    '我们会在 1-3 个工作日内完成审核。',
    '审核通过后，网站将展示在相应分类中。',
    '优质网站有机会获得推荐和首页展示。',
  ],
  markdownHints: [
    '# 标题',
    '## 二级标题',
    '**粗体文本**',
    '*斜体文本*',
    '- 无序列表',
    '1. 有序列表',
    '[链接文本](https://example.com)',
    '> 引用文本',
  ],
}))

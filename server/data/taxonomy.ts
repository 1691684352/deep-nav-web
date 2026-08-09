import type { Category, NavCategory } from '#shared/types'

/** Sidebar categories. `全部` is the pseudo category used by the prototype. */
export const categories: Category[] = [
  { slug: 'all', name: '全部', label: '发现首页', icon: 'house', description: '全站收录的优质网站与工具', toolCount: 0 },
  { slug: 'ai', name: 'AI工具', label: 'AI 工具', icon: 'sparkles', description: '智能对话、智能体与通用 AI 服务', toolCount: 0 },
  { slug: 'productivity', name: '效率工具', label: '效率工具', icon: 'gauge', description: '文档协作、任务管理与办公提效', toolCount: 0 },
  { slug: 'design', name: '设计创意', label: '设计创意', icon: 'palette', description: '视觉设计、图像生成与创意素材', toolCount: 0 },
  { slug: 'dev', name: '开发技术', label: '开发技术', icon: 'braces', description: '编程辅助、部署运维与开发平台', toolCount: 0 },
  { slug: 'content', name: '内容创作', label: '内容创作', icon: 'pen-tool', description: '写作、音视频与内容生产工具', toolCount: 0 },
  { slug: 'data', name: '数据分析', label: '数据分析', icon: 'chart-no-axes-combined', description: '数据可视化与商业智能分析', toolCount: 0 },
  { slug: 'education', name: '学习教育', label: '学习教育', icon: 'graduation-cap', description: '在线课程、学术检索与知识沉淀', toolCount: 0 },
  { slug: 'marketing', name: '运营推广', label: '运营推广', icon: 'megaphone', description: '增长营销、社媒运营与投放分析', toolCount: 0 },
  { slug: 'media', name: '影音娱乐', label: '影音娱乐', icon: 'clapperboard', description: '影音平台与灵感内容资源', toolCount: 0 },
  { slug: 'life', name: '生活方式', label: '生活方式', icon: 'coffee', description: '发现更好的日常体验与生活服务', toolCount: 0 },
  { slug: 'industry', name: '行业资源', label: '行业资源', icon: 'layers-3', description: '垂直领域的优质站点与资讯', toolCount: 0 },
]

/** Secondary tabs inside the navigation panel. */
export const navCategories: NavCategory[] = [
  { slug: 'hot', name: '热门', label: '热门', title: '热门推荐', description: '全站高热度的优质工具', icon: 'flame' },
  { slug: 'ai-agents', name: 'AI Agents', label: 'AI Agents', title: 'AI 智能体', description: '任务编排与自动化工作流平台', icon: 'bot' },
  { slug: 'ai-assistant', name: 'AI助手', label: 'AI助手', title: 'AI 对话', description: '智能问答、知识推理与多模型助手', icon: 'messages-square' },
  { slug: 'ai-image', name: 'AI图像', label: 'AI图像', title: 'AI 绘画', description: '文生图、图像编辑与视觉创作', icon: 'image' },
  { slug: 'ai-video', name: 'AI视频', label: 'AI视频', title: 'AI 视频', description: '生成视频、数字人与视频编辑', icon: 'clapperboard' },
  { slug: 'ai-office', name: 'AI办公', label: 'AI办公', title: 'AI 办公', description: '写作、演示与协作效率工具', icon: 'file-code-2' },
  { slug: 'ai-audio', name: 'AI音频', label: 'AI音频', title: 'AI 音频', description: '音乐生成、语音合成与音频处理', icon: 'waves' },
  { slug: 'ai-coding', name: 'AI开发', label: 'AI开发', title: 'AI 编程', description: '代码生成、调试与应用开发', icon: 'code-2' },
  { slug: 'ai-creative', name: 'AI创意', label: 'AI创意', title: 'AI 创作', description: '设计灵感、创意表达与内容生成', icon: 'wand-sparkles' },
]

/** Order used by the category page to render one section per subcategory. */
export const categoryGroupOrder = [
  'ai-assistant',
  'ai-image',
  'ai-video',
  'ai-office',
  'ai-audio',
  'ai-coding',
  'ai-creative',
  'ai-agents',
]

export const categoryByName = new Map(categories.map(item => [item.name, item]))
export const categoryBySlug = new Map(categories.map(item => [item.slug, item]))
export const navCategoryByName = new Map(navCategories.map(item => [item.name, item]))
export const navCategoryBySlug = new Map(navCategories.map(item => [item.slug, item]))

/** Stacked favicon rows used by topic cards. */
export const topicIconSets: Record<string, string[]> = {
  ai: ['chatgpt.com', 'midjourney.com', 'heygen.com', 'poe.com', 'perplexity.ai'],
  office: ['notion.so', 'docs.qq.com', 'flowus.cn', 'trello.com', 'slack.com'],
  design: ['figma.com', 'canva.com', 'midjourney.com', 'remove.bg', 'framer.com'],
  code: ['github.com', 'vercel.com', 'cursor.com', 'codepen.io', 'stackoverflow.com'],
  content: ['xhs.com', 'mp.weixin.qq.com', 'medium.com', 'grammarly.com', 'substack.com'],
  data: ['tableau.com', 'lookerstudio.google.com', 'metabase.com', 'airtable.com', 'excel.cloud.microsoft'],
  learn: ['coursera.org', 'edx.org', 'notion.so', 'khanacademy.org', 'wikipedia.org'],
  growth: ['buffer.com', 'mailchimp.com', 'semrush.com', 'ahrefs.com', 'hubspot.com'],
  media: ['youtube.com', 'bilibili.com', 'spotify.com', 'vimeo.com', 'netflix.com'],
  life: ['douban.com', 'xiaohongshu.com', 'weather.com', 'keep.com', 'meituan.com'],
  industry: ['producthunt.com', '36kr.com', 'zhihu.com', 'juejin.cn', 'sspai.com'],
  trend: ['x.com', 'reddit.com', 'hackernews.com', 'producthunt.com', 'github.com'],
}

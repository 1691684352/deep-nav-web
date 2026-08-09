import type { Topic } from '#shared/types'
import { topicIconSets } from './taxonomy'

interface RawTopic {
  slug: string
  title: string
  description: string
  iconSet: keyof typeof topicIconSets
  toolCount: number
  accent?: Topic['accent']
  categorySlug: string
  navCategorySlug?: string
  intro?: string
}

const rawTopics: RawTopic[] = [
  { slug: 'ai', title: 'AI 人工智能', description: '探索最前沿的 AI 工具', iconSet: 'ai', toolCount: 32, accent: 'indigo', categorySlug: 'ai' },
  { slug: 'office', title: '办公效率', description: '提升工作效率的必备应用', iconSet: 'office', toolCount: 45, accent: 'neutral', categorySlug: 'productivity', navCategorySlug: 'ai-office' },
  { slug: 'design', title: '设计创作', description: '激发创意的设计资源', iconSet: 'design', toolCount: 28, accent: 'slate', categorySlug: 'design', navCategorySlug: 'ai-creative' },
  { slug: 'code', title: '编程开发', description: '开发者必备工具集合', iconSet: 'code', toolCount: 36, accent: 'blue', categorySlug: 'dev', navCategorySlug: 'ai-coding' },
  { slug: 'content', title: '内容创作', description: '提升内容产出的创作工具', iconSet: 'content', toolCount: 41, accent: 'neutral', categorySlug: 'content' },
  { slug: 'data', title: '数据分析', description: '用数据辅助业务决策', iconSet: 'data', toolCount: 23, accent: 'neutral', categorySlug: 'data' },
  { slug: 'learn', title: '学习教育', description: '高效学习与知识沉淀', iconSet: 'learn', toolCount: 37, accent: 'neutral', categorySlug: 'education' },
  { slug: 'growth', title: '运营推广', description: '品牌传播与增长工具', iconSet: 'growth', toolCount: 29, accent: 'neutral', categorySlug: 'marketing' },
  { slug: 'media', title: '影音娱乐', description: '影音与灵感内容资源', iconSet: 'media', toolCount: 18, accent: 'neutral', categorySlug: 'media' },
  { slug: 'life', title: '生活方式', description: '发现更好的日常体验', iconSet: 'life', toolCount: 26, accent: 'neutral', categorySlug: 'life' },
  { slug: 'industry', title: '行业资源', description: '垂直领域优质站点', iconSet: 'industry', toolCount: 34, accent: 'neutral', categorySlug: 'industry' },
  { slug: 'trend', title: '热门趋势', description: '全网关注的前沿工具', iconSet: 'trend', toolCount: 22, accent: 'neutral', categorySlug: 'all' },
  { slug: 'ai-writing', title: 'AI 写作', description: '文案创作与智能写作工具', iconSet: 'content', toolCount: 33, accent: 'neutral', categorySlug: 'content', navCategorySlug: 'ai-office' },
  { slug: 'ai-image', title: 'AI 图像', description: '图像生成与编辑工具', iconSet: 'design', toolCount: 29, accent: 'neutral', categorySlug: 'design', navCategorySlug: 'ai-image' },
  { slug: 'ai-video', title: 'AI 视频', description: '视频生成与后期创作工具', iconSet: 'media', toolCount: 24, accent: 'neutral', categorySlug: 'content', navCategorySlug: 'ai-video' },
  { slug: 'ai-audio', title: 'AI 音频', description: '语音与音乐创作工具', iconSet: 'media', toolCount: 18, accent: 'neutral', categorySlug: 'content', navCategorySlug: 'ai-audio' },
  { slug: 'product-design', title: '产品设计', description: '用户体验与产品设计资源', iconSet: 'design', toolCount: 31, accent: 'neutral', categorySlug: 'design', navCategorySlug: 'ai-creative' },
  { slug: 'collaboration', title: '协同办公', description: '团队协作与文档管理工具', iconSet: 'office', toolCount: 27, accent: 'neutral', categorySlug: 'productivity', navCategorySlug: 'ai-office' },
  { slug: 'project-management', title: '项目管理', description: '任务规划与团队协同工具', iconSet: 'office', toolCount: 22, accent: 'neutral', categorySlug: 'productivity' },
  { slug: 'open-source', title: '开源工具', description: '开源社区与开发资源', iconSet: 'code', toolCount: 35, accent: 'neutral', categorySlug: 'dev', navCategorySlug: 'ai-coding' },
  { slug: 'low-code', title: '低代码开发', description: '无代码与低代码应用工具', iconSet: 'code', toolCount: 20, accent: 'neutral', categorySlug: 'dev', navCategorySlug: 'ai-coding' },
  { slug: 'digital-marketing', title: '数字营销', description: '品牌增长与传播工具', iconSet: 'growth', toolCount: 26, accent: 'neutral', categorySlug: 'marketing' },
  { slug: 'data-visualization', title: '数据可视化', description: '图表制作与数据呈现工具', iconSet: 'data', toolCount: 19, accent: 'neutral', categorySlug: 'data' },
  { slug: 'remote-work', title: '远程办公', description: '分布式团队工作方式', iconSet: 'office', toolCount: 17, accent: 'neutral', categorySlug: 'productivity' },
]

export const topics: Topic[] = rawTopics.map((raw, index) => ({
  id: `topic-${String(index + 1).padStart(3, '0')}`,
  slug: raw.slug,
  title: raw.title,
  description: raw.description,
  icons: topicIconSets[raw.iconSet] ?? [],
  toolCount: raw.toolCount,
  accent: raw.accent ?? 'neutral',
  categorySlug: raw.categorySlug,
  navCategorySlug: raw.navCategorySlug,
}))

export const topicBySlug = new Map(topics.map(topic => [topic.slug, topic]))

/** The four cards promoted on the home page. */
export const homeTopicSlugs = ['ai', 'office', 'design', 'code']

export const topicIntros: Record<string, string> = {
  ai: '汇集主流大模型助手、智能体平台与 AI 搜索工具，覆盖问答、推理、内容生成等高频场景。',
  office: '从文档协作到流程自动化，帮助团队把重复工作交给工具，把时间留给决策。',
  design: '面向设计师与创作者，整理从灵感采集、素材获取到成稿输出的完整链路。',
  code: '面向开发者的编程助手、部署平台与协作工具，覆盖从编码到上线的日常工作流。',
}

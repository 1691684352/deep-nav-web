import type { Review, ToolDetail, ToolFeature } from '#shared/types'

type DetailOverride = Partial<Pick<
  ToolDetail,
  'slogan' | 'siteTags' | 'overview' | 'features' | 'gallery' | 'stats' | 'rating' | 'ratingCount' | 'ratingBuckets' | 'news'
>>

const deepseekOverview = `## DeepSeek 简介

DeepSeek 是由深度求索推出的通用人工智能助手，提供自然语言对话、深度思考、代码生成与知识问答能力。它适合在研究、写作、编程和日常工作中快速获得清晰、可靠的协助。

## 1. 产品定位与背景

### AI 大模型对话助手

DeepSeek 以高质量推理与生成能力为核心，将复杂问题拆解为可理解的回答，并支持在连续对话中保留上下文。

### 国产自主研发

团队持续探索模型训练、推理优化与开放生态，为个人用户和开发者提供高效易用的智能服务。

## 2. 主要功能特点

<!-- features -->

## 3. 应用场景与用户价值

- **内容创作：** 辅助撰写文章、报告与文案，提高输出效率。
- **编程开发：** 解释代码逻辑、定位问题、生成技术文档。
- **学习研究：** 梳理知识点与阅读材料，构建学习路径。
- **商业办公：** 生成邮件、分析信息与规划任务，减少重复工作。

## 总结

DeepSeek 将通用智能能力融入高频工作场景，适合需要快速研究、思考与表达的个人及团队。实际体验请以官网当前能力和服务条款为准。`

const deepseekFeatures: ToolFeature[] = [
  { icon: 'messages-square', title: '智能对话', description: '理解多轮上下文，快速组织思路并完成问答。' },
  { icon: 'brain-circuit', title: '深度推理', description: '面向复杂问题提供更完整的分析和方案。' },
  { icon: 'code-2', title: '多场景应用', description: '支持编程、写作、翻译、知识问答等任务。' },
  { icon: 'languages', title: '长文本处理', description: '帮助总结长内容、提取重点与生成提纲。' },
]

export const toolDetailOverrides: Record<string, DetailOverride> = {
  deepseek: {
    slogan: '探索未知之境，智能引领未来',
    siteTags: ['AI 对话', '智能助手', '国产大模型', '免费使用'],
    overview: deepseekOverview,
    features: deepseekFeatures,
    stats: [
      { value: '98.7k', label: '月均浏览' },
      { value: '2026-01-15', label: '收录时间' },
    ],
    gallery: {
      main: { src: '/assets/deepseek-site-main.png', alt: 'DeepSeek 官网首页截图', width: 648, height: 317 },
      thumbs: [
        { src: '/assets/deepseek-site-1.png', alt: 'DeepSeek 对话功能截图', width: 157, height: 153 },
        { src: '/assets/deepseek-site-2.png', alt: 'DeepSeek 功能界面截图', width: 157, height: 153 },
        { src: '/assets/deepseek-site-3.png', alt: 'DeepSeek 页面截图', width: 168, height: 153 },
      ],
      extra: [
        { src: '/assets/deepseek-site-4.png', alt: 'DeepSeek 模型能力截图', width: 648, height: 317 },
        { src: '/assets/deepseek-site-5.png', alt: 'DeepSeek 开放平台截图', width: 648, height: 317 },
        { src: '/assets/deepseek-site-6.png', alt: 'DeepSeek 定价说明截图', width: 648, height: 317 },
      ],
    },
    rating: 4.8,
    ratingCount: 52,
    ratingBuckets: [
      { score: 5, count: 38 },
      { score: 4, count: 9 },
      { score: 3, count: 3 },
      { score: 2, count: 1 },
      { score: 1, count: 1 },
    ],
    news: [
      { id: 'news-001', title: 'DeepSeek 发布新一代推理模型，长文本理解能力显著提升', source: '机器之心', publishedAt: '2026-01-28', url: 'https://www.deepseek.com' },
      { id: 'news-002', title: '开发者实测：DeepSeek 在代码生成任务上的表现', source: '掘金', publishedAt: '2026-01-21', url: 'https://www.deepseek.com' },
      { id: 'news-003', title: 'DeepSeek 开放平台上线批量推理接口', source: '量子位', publishedAt: '2026-01-12', url: 'https://www.deepseek.com' },
    ],
  },
  trae: {
    slogan: 'AI 辅助编程，代码自动修复',
    siteTags: ['AI 编程', '代码生成', '智能补全', '免费使用'],
    features: [
      { icon: 'code-2', title: '智能补全', description: '结合项目上下文给出可用的代码建议。' },
      { icon: 'wand-sparkles', title: '自动修复', description: '识别报错原因并给出可直接应用的补丁。' },
      { icon: 'file-code-2', title: '工程理解', description: '读取仓库结构，跨文件完成重构任务。' },
      { icon: 'bot', title: '任务代理', description: '把需求拆成步骤，逐步完成开发工作。' },
    ],
    rating: 4.7,
    ratingCount: 86,
  },
  chatgpt: {
    slogan: '通用型智能对话助手',
    siteTags: ['AI 对话', '智能助手', '多模态', '会员专享'],
    rating: 4.9,
    ratingCount: 210,
  },
}

/** Generic features used when a tool has no curated content yet. */
export const defaultFeatures: ToolFeature[] = [
  { icon: 'sparkles', title: '开箱即用', description: '无需复杂配置，注册后即可开始使用核心能力。' },
  { icon: 'gauge', title: '效率提升', description: '把重复性工作交给工具，专注更有价值的决策。' },
  { icon: 'shield-check', title: '稳定可靠', description: '服务持续迭代，能力与文档同步更新。' },
  { icon: 'users', title: '协作友好', description: '支持团队共享与协作，沉淀可复用的成果。' },
]

export const reviews: Review[] = [
  { id: 'review-001', toolSlug: 'deepseek', author: '科技探索者', avatarText: '科', rating: 5, content: 'DeepSeek 的对话体验非常自然，回答准确且逻辑清晰，帮助我提升了不少工作效率。', createdAt: '2025-05-15 10:30', likes: 12 },
  { id: 'review-002', toolSlug: 'deepseek', author: '产品经理小林', avatarText: '林', rating: 5, content: '写需求文档时用它整理思路，输出结构比我自己列的还完整，改两笔就能用。', createdAt: '2025-06-02 09:14', likes: 8 },
  { id: 'review-003', toolSlug: 'deepseek', author: '后端老王', avatarText: '王', rating: 4, content: '代码解释和排错都不错，偶尔在冷门框架上会给出过时的写法，需要自己确认一下。', createdAt: '2025-06-18 21:47', likes: 5 },
  { id: 'review-004', toolSlug: 'trae', author: '前端阿May', avatarText: 'M', rating: 5, content: '跨文件重构是真的省事，改完还会顺手把引用一起更新。', createdAt: '2025-07-04 15:22', likes: 9 },
  { id: 'review-005', toolSlug: 'trae', author: '全栈小周', avatarText: '周', rating: 4, content: '补全质量高，大项目里首次索引稍慢，之后就很流畅了。', createdAt: '2025-07-19 11:05', likes: 4 },
  { id: 'review-006', toolSlug: 'chatgpt', author: '内容运营Ada', avatarText: 'A', rating: 5, content: '写文案、改标题、翻译，一个工具全覆盖，团队里几乎人人都在用。', createdAt: '2025-08-01 08:40', likes: 16 },
  { id: 'review-007', toolSlug: 'midjourney', author: '插画师阿橘', avatarText: '橘', rating: 5, content: '出图质量依然是第一梯队，风格一致性控制得比同类好很多。', createdAt: '2025-08-12 19:33', likes: 11 },
  { id: 'review-008', toolSlug: 'figma', author: 'UI设计师Nina', avatarText: 'N', rating: 5, content: '协作评审流程很顺，开发直接取值，来回沟通成本明显下降。', createdAt: '2025-08-25 14:08', likes: 7 },
]

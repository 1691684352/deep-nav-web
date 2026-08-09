/**
 * Longer copy shown on the dedicated search-results page. Anything not listed
 * here falls back to the catalog description.
 */
export const searchMetaOverrides: Record<string, { desc: string, meta: string }> = {
  chatgpt: { desc: 'OpenAI 推出的先进人工智能对话模型，能够理解并生成自然语言，帮助用户解决问题、创作内容。', meta: 'AI 工具' },
  midjourney: { desc: 'AI 绘画工具，通过文本描述生成高质量艺术图像，广泛应用于设计、插画和创意领域。', meta: 'AI 绘画工具' },
  notion: { desc: '集笔记、文档、任务管理和数据库于一体的全能工作空间，提升个人与团队效率。', meta: '在线笔记协作' },
  figma: { desc: '在线协作设计工具，支持界面设计、原型制作和团队实时协作，广受设计师喜爱。', meta: '在线设计工具' },
  canva: { desc: '简单易用的在线设计平台，提供海量模板，适合快速制作海报、演示文稿等视觉内容。', meta: '在线设计平台' },
  github: { desc: '全球领先的代码托管平台，支持版本控制、协作开发和开源项目管理。', meta: '代码托管平台' },
  vercel: { desc: '前端开发与部署平台，专注于现代 Web 应用的构建、部署和性能优化。', meta: '开发者平台' },
  'remove-bg': { desc: 'AI 背景移除工具，自动识别并去除图片背景，支持高清下载。', meta: 'AI 图片背景移除工具' },
  deepseek: { desc: '深度求索推出的通用人工智能助手，擅长深度推理、代码生成与长文本理解。', meta: 'AI 对话助手' },
  trae: { desc: '面向工程项目的 AI 编程助手，支持跨文件重构、自动修复与任务代理。', meta: 'AI 编程工具' },
  kimi: { desc: '支持超长上下文的中文智能助手，擅长资料阅读、总结与整理。', meta: '长文本 AI 助手' },
  coze: { desc: '一站式 AI Agent 开发平台，可视化编排插件、知识库与工作流。', meta: 'AI 智能体平台' },
  cursor: { desc: '面向开发者的 AI 代码编辑器，把补全、重构与调试整合到同一个工作流。', meta: 'AI 代码编辑器' },
  jimeng: { desc: '字节跳动推出的中文 AI 创作平台，支持图片与视频生成。', meta: 'AI 创作平台' },
  suno: { desc: '输入一句描述即可生成带人声的完整音乐作品。', meta: 'AI 音乐生成' },
  'notion-ai': { desc: '内置于 Notion 的 AI 能力，覆盖写作、总结、翻译与知识检索。', meta: 'AI 办公助手' },
}

export const searchSortOptions = [
  { value: 'heat', label: '按热度排序' },
  { value: 'newest', label: '按最新排序' },
  { value: 'name', label: '按名称排序' },
] as const

export const searchSortValues = searchSortOptions.map(item => item.value)

export const searchSuggestions = ['ChatGPT', 'AI 绘画', 'Notion', '开发技术', 'AI 视频', '数据分析']

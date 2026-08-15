import type { LatestTool, Tool } from '#shared/types'
import { categoryByName, navCategoryByName } from './taxonomy'

interface RawTool {
  slug: string
  name: string
  desc: string
  category: string
  navCategory: string
  domain: string
  url: string
  heat: string
  verified?: boolean
  tags?: string[]
  createdAt?: string
}

const rawTools: RawTool[] = [
  { slug: 'trae', name: 'TRAE 编程', desc: 'AI 辅助编程与代码生成', category: '开发技术', navCategory: 'AI开发', domain: 'trae.ai', url: 'https://www.trae.ai', heat: '98.7k', verified: true, tags: ['热门推荐', '免费使用', '在线工具'], createdAt: '2026-01-04' },
  { slug: 'doubao-coding', name: '豆包 Coding', desc: '豆包旗下 AI 编程工具', category: '开发技术', navCategory: 'AI开发', domain: 'doubao.com', url: 'https://www.doubao.com', heat: '93.4k', verified: true, tags: ['热门推荐', '免费使用'], createdAt: '2026-01-06' },
  { slug: 'xfyun-huijing', name: '讯飞绘镜', desc: '描述即创作，轻松生成图片', category: '设计创意', navCategory: 'AI图像', domain: 'xfyun.cn', url: 'https://www.xfyun.cn', heat: '88.9k', tags: ['免费使用', '在线工具'], createdAt: '2026-01-08' },
  { slug: 'sensetime-raccoon', name: '商汤小浣熊', desc: '面向工作的智能分析助手', category: 'AI工具', navCategory: 'AI助手', domain: 'sensetime.com', url: 'https://www.sensetime.com', heat: '86.2k', tags: ['在线工具'], createdAt: '2026-01-09' },
  { slug: 'coze', name: '扣子', desc: '一站式 AI Agent 开发平台', category: 'AI工具', navCategory: 'AI Agents', domain: 'coze.cn', url: 'https://www.coze.cn', heat: '84.8k', verified: true, tags: ['热门推荐', '免费使用', '在线工具'], createdAt: '2026-01-10' },
  { slug: 'feishu-base', name: '飞书多维表格', desc: '无需代码搭建业务系统', category: '效率工具', navCategory: 'AI办公', domain: 'feishu.cn', url: 'https://www.feishu.cn/product/base', heat: '81.5k', verified: true, tags: ['热门推荐', '免费使用'], createdAt: '2026-01-11' },
  { slug: 'xfyun-huiwen', name: '讯飞绘文', desc: '选题、配图、成文一站完成', category: '内容创作', navCategory: 'AI办公', domain: 'xfyun.cn', url: 'https://www.xfyun.cn', heat: '78.6k', tags: ['免费使用', '在线工具'], createdAt: '2026-01-12' },
  { slug: 'codeflying', name: '码上飞', desc: '零代码 AI 应用开发平台', category: '开发技术', navCategory: 'AI开发', domain: 'codeflying.net', url: 'https://www.codeflying.net', heat: '76.9k', tags: ['在线工具'], createdAt: '2026-01-13' },
  { slug: 'xfyun-zhiwen', name: '讯飞智文', desc: '一键生成 PPT 与 Word', category: '效率工具', navCategory: 'AI办公', domain: 'xfyun.cn', url: 'https://zhiwen.xfyun.cn', heat: '74.3k', tags: ['免费使用', '在线工具'], createdAt: '2026-01-14' },
  { slug: 'chatgpt', name: 'ChatGPT', desc: '通用型智能对话助手', category: 'AI工具', navCategory: 'AI助手', domain: 'chatgpt.com', url: 'https://chatgpt.com', heat: '72.8k', verified: true, tags: ['热门推荐', '会员专享', '在线工具'], createdAt: '2026-01-15' },
  { slug: 'deepseek', name: 'DeepSeek', desc: '深度思考与知识推理模型', category: 'AI工具', navCategory: 'AI助手', domain: 'deepseek.com', url: 'https://www.deepseek.com', heat: '70.5k', verified: true, tags: ['热门推荐', '免费使用', '在线工具'], createdAt: '2026-01-15' },
  { slug: 'kimi', name: 'Kimi', desc: '长文本阅读与资料整理助手', category: 'AI工具', navCategory: 'AI助手', domain: 'kimi.moonshot.cn', url: 'https://kimi.moonshot.cn', heat: '68.1k', verified: true, tags: ['免费使用', '在线工具'], createdAt: '2026-01-16' },
  { slug: 'midjourney', name: 'Midjourney', desc: '高质量 AI 图像生成工具', category: '设计创意', navCategory: 'AI图像', domain: 'midjourney.com', url: 'https://www.midjourney.com', heat: '65.7k', verified: true, tags: ['热门推荐', '会员专享', '在线工具'], createdAt: '2026-01-17' },
  { slug: 'jimeng', name: '即梦 AI', desc: '中文创意图片与视频生成', category: '设计创意', navCategory: 'AI图像', domain: 'jimeng.jianying.com', url: 'https://jimeng.jianying.com', heat: '63.9k', verified: true, tags: ['热门推荐', '免费使用', '在线工具'], createdAt: '2026-01-18' },
  { slug: 'canva', name: 'Canva', desc: '在线设计与创意内容平台', category: '设计创意', navCategory: 'AI创意', domain: 'canva.com', url: 'https://www.canva.com', heat: '61.3k', verified: true, tags: ['热门推荐', '免费使用', '在线工具', '移动应用'], createdAt: '2026-01-19' },
  { slug: 'kling', name: '可灵 AI', desc: '高品质 AI 视频生成平台', category: '内容创作', navCategory: 'AI视频', domain: 'klingai.com', url: 'https://klingai.com', heat: '58.6k', tags: ['热门推荐', '会员专享'], createdAt: '2026-01-20' },
  { slug: 'runway', name: 'Runway', desc: '专业级生成式视频工具', category: '内容创作', navCategory: 'AI视频', domain: 'runwayml.com', url: 'https://runwayml.com', heat: '55.4k', tags: ['会员专享', '在线工具'], createdAt: '2026-01-21' },
  { slug: 'heygen', name: 'HeyGen', desc: 'AI 数字人与视频生成平台', category: '内容创作', navCategory: 'AI视频', domain: 'heygen.com', url: 'https://www.heygen.com', heat: '52.8k', tags: ['会员专享', '在线工具'], createdAt: '2026-01-22' },
  { slug: 'suno', name: 'Suno', desc: '输入描述即可生成完整音乐', category: '内容创作', navCategory: 'AI音频', domain: 'suno.com', url: 'https://suno.com', heat: '49.5k', tags: ['热门推荐', '免费使用'], createdAt: '2026-01-23' },
  { slug: 'elevenlabs', name: 'ElevenLabs', desc: '自然流畅的 AI 语音生成', category: '内容创作', navCategory: 'AI音频', domain: 'elevenlabs.io', url: 'https://elevenlabs.io', heat: '46.2k', tags: ['会员专享', '在线工具'], createdAt: '2026-01-24' },
  { slug: 'cursor', name: 'Cursor', desc: '面向开发者的 AI 代码编辑器', category: '开发技术', navCategory: 'AI开发', domain: 'cursor.com', url: 'https://www.cursor.com', heat: '43.8k', verified: true, tags: ['热门推荐', '会员专享'], createdAt: '2026-01-25' },
  { slug: 'notion-ai', name: 'Notion AI', desc: '写作、总结与知识管理', category: '效率工具', navCategory: 'AI办公', domain: 'notion.so', url: 'https://www.notion.so/product/ai', heat: '41.7k', verified: true, tags: ['热门推荐', '会员专享', '在线工具'], createdAt: '2026-01-26' },
  { slug: 'figma', name: 'Figma', desc: '在线产品设计与团队协作', category: '设计创意', navCategory: 'AI创意', domain: 'figma.com', url: 'https://www.figma.com', heat: '39.6k', verified: true, tags: ['热门推荐', '免费使用', '在线工具'], createdAt: '2026-01-27' },
  { slug: 'dify', name: 'Dify', desc: '开源大模型应用开发平台', category: 'AI工具', navCategory: 'AI Agents', domain: 'dify.ai', url: 'https://dify.ai', heat: '36.9k', tags: ['免费使用', '在线工具'], createdAt: '2026-01-28' },
  { slug: 'claude', name: 'Claude', desc: '擅长写作与代码的智能助手', category: 'AI工具', navCategory: 'AI助手', domain: 'claude.ai', url: 'https://claude.ai', heat: '71.4k', verified: true, tags: ['热门推荐', '会员专享', '在线工具'], createdAt: '2026-01-28' },
]

/** Extra records the ranking board mixes into the catalog. */
const rawRankingExtras: RawTool[] = [
  { slug: 'github', name: 'GitHub', desc: '全球开发者协作平台', category: '开发技术', navCategory: 'AI开发', domain: 'github.com', url: 'https://github.com', heat: '59.8k', verified: true, tags: ['免费使用', '在线工具'], createdAt: '2025-12-01' },
  { slug: 'vercel', name: 'Vercel', desc: '面向前端团队的部署平台', category: '开发技术', navCategory: 'AI开发', domain: 'vercel.com', url: 'https://vercel.com', heat: '45.2k', tags: ['免费使用', '在线工具'], createdAt: '2025-12-02' },
  { slug: 'tableau', name: 'Tableau', desc: '数据可视化与商业分析工具', category: '数据分析', navCategory: 'AI办公', domain: 'tableau.com', url: 'https://www.tableau.com', heat: '37.8k', tags: ['会员专享'], createdAt: '2025-12-03' },
  { slug: 'feishu-base-analytics', name: '飞书多维表格', desc: '零代码业务数据管理工具', category: '数据分析', navCategory: 'AI办公', domain: 'feishu.cn', url: 'https://www.feishu.cn/product/base', heat: '34.6k', tags: ['免费使用'], createdAt: '2025-12-04' },
  { slug: 'google-scholar', name: 'Google Scholar', desc: '学术资料检索与研究辅助', category: '学习教育', navCategory: 'AI办公', domain: 'scholar.google.com', url: 'https://scholar.google.com', heat: '31.2k', tags: ['免费使用'], createdAt: '2025-12-05' },
  { slug: 'coursera', name: 'Coursera', desc: '全球在线课程学习平台', category: '学习教育', navCategory: 'AI办公', domain: 'coursera.org', url: 'https://www.coursera.org', heat: '29.8k', tags: ['会员专享'], createdAt: '2025-12-06' },
  { slug: 'notion', name: 'Notion', desc: '团队知识库与项目协作空间', category: '效率工具', navCategory: 'AI办公', domain: 'notion.so', url: 'https://www.notion.so', heat: '76.1k', verified: true, tags: ['热门推荐', '免费使用', '在线工具'], createdAt: '2025-12-07' },
  { slug: 'remove-bg', name: 'Remove.bg', desc: '在线智能抠图工具', category: '设计创意', navCategory: 'AI图像', domain: 'remove.bg', url: 'https://www.remove.bg', heat: '42.5k', tags: ['热门推荐', '在线工具'], createdAt: '2025-12-08' },
  { slug: 'flowus', name: 'FlowUs', desc: '新一代知识管理与协作平台', category: '效率工具', navCategory: 'AI办公', domain: 'flowus.cn', url: 'https://flowus.cn', heat: '36.4k', tags: ['免费使用', '在线工具'], createdAt: '2025-12-09' },
  { slug: 'power-bi', name: 'Power BI', desc: '商业智能与数据可视化工具', category: '数据分析', navCategory: 'AI办公', domain: 'powerbi.microsoft.com', url: 'https://powerbi.microsoft.com', heat: '30.6k', tags: ['会员专享'], createdAt: '2025-12-10' },
  { slug: 'wolfram-alpha', name: 'Wolfram Alpha', desc: '计算知识与学习研究工具', category: '学习教育', navCategory: 'AI办公', domain: 'wolframalpha.com', url: 'https://www.wolframalpha.com', heat: '27.1k', tags: ['免费使用'], createdAt: '2025-12-11' },
]

function toHeatValue(heat: string): number {
  const numeric = Number.parseFloat(heat) || 0
  return /k/i.test(heat) ? Math.round(numeric * 1000) : numeric
}

function normalize(raw: RawTool, index: number, prefix: string): Tool {
  return {
    id: `${prefix}-${String(index + 1).padStart(3, '0')}`,
    slug: raw.slug,
    name: raw.name,
    desc: raw.desc,
    category: raw.category,
    categorySlug: categoryByName.get(raw.category)?.slug ?? 'all',
    navCategory: raw.navCategory,
    navCategorySlug: navCategoryByName.get(raw.navCategory)?.slug ?? 'hot',
    domain: raw.domain,
    url: raw.url,
    heat: raw.heat,
    heatValue: toHeatValue(raw.heat),
    verified: raw.verified ?? false,
    tags: raw.tags ?? [],
    createdAt: raw.createdAt ?? '2026-01-01',
  }
}

/** Promoted partners that only appear in recommendation modules. */
const rawPromoTools: RawTool[] = [
  { slug: 'vebase', name: 'Vebase', desc: '你的 AI Agent 团队', category: 'AI工具', navCategory: 'AI Agents', domain: 'vebase.com', url: 'https://vebase.com', heat: '33.2k', verified: true, tags: ['热门推荐'], createdAt: '2026-01-29' },
  { slug: 'qoderwork', name: 'QoderWork', desc: '阿里 Qoder 团队推出的桌面工具', category: '开发技术', navCategory: 'AI开发', domain: 'qoder.com', url: 'https://qoder.com', heat: '31.8k', verified: true, tags: ['最新收录'], createdAt: '2026-01-30' },
]

export const tools: Tool[] = rawTools.map((raw, index) => normalize(raw, index, 'tool'))
export const rankingExtras: Tool[] = rawRankingExtras.map((raw, index) => normalize(raw, index, 'rank'))
export const promoTools: Tool[] = rawPromoTools.map((raw, index) => normalize(raw, index, 'promo'))

/** Every record the site can address, including ranking-only and promo entries. */
export const allTools: Tool[] = [...tools, ...rankingExtras, ...promoTools]

export const toolBySlug = new Map(allTools.map(tool => [tool.slug, tool]))
export const toolByName = new Map(tools.map(tool => [tool.name, tool]))

const rawLatest: Array<Omit<LatestTool, 'id' | 'url'> & { url?: string }> = [
  { slug: 'cursor', name: 'Cursor', category: 'AI工具', desc: 'AI 编程助手、智能代码编辑器', time: '2 小时前', gain: '1.2k', domain: 'cursor.com' },
  { slug: 'heygen', name: 'HeyGen', category: 'AI工具', desc: 'AI 数字人视频生成平台', time: '3 小时前', gain: '866', domain: 'heygen.com' },
  { slug: 'flowus', name: 'FlowUs', category: '效率工具', desc: '新一代知识管理与协作平台', time: '5 小时前', gain: '902', domain: 'flowus.cn' },
  { slug: 'remove-bg', name: 'Remove.bg', category: '设计创意', desc: 'AI 图片背景移除工具', time: '8 小时前', gain: '1.1k', domain: 'remove.bg' },
  { slug: 'poe', name: 'Poe', category: 'AI工具', desc: '多模型 AI 对话平台', time: '8 小时前', gain: '743', domain: 'poe.com' },
  { slug: 'gamma', name: 'Gamma', category: '效率工具', desc: 'AI 演示文稿与网页生成工具', time: '9 小时前', gain: '688', domain: 'gamma.app' },
  { slug: 'napkin-ai', name: 'Napkin AI', category: '设计创意', desc: '将文字快速转成可视化图表', time: '10 小时前', gain: '621', domain: 'napkin.ai' },
  { slug: 'perplexity', name: 'Perplexity', category: 'AI工具', desc: '带引用来源的 AI 搜索引擎', time: '11 小时前', gain: '598', domain: 'perplexity.ai' },
  { slug: 'metaso', name: '秘塔 AI 搜索', category: 'AI工具', desc: '中文智能搜索与资料研究平台', time: '12 小时前', gain: '556', domain: 'metaso.cn' },
  { slug: 'windsurf', name: 'Windsurf', category: '开发技术', desc: '面向开发者的智能编程环境', time: '13 小时前', gain: '519', domain: 'windsurf.com' },
]

export const latestTools: LatestTool[] = rawLatest.map((raw, index) => ({
  id: `latest-${String(index + 1).padStart(3, '0')}`,
  slug: raw.slug,
  name: raw.name,
  category: raw.category,
  desc: raw.desc,
  time: raw.time,
  gain: raw.gain,
  domain: raw.domain,
  url: raw.url ?? toolBySlug.get(raw.slug)?.url ?? `https://${raw.domain}`,
}))

/** Sidebar "推荐工具" module. Index 2 is a promoted partner slot. */
export const recommendedTools: Tool[] = [
  tools[0]!,
  tools[4]!,
  promoTools[0]!,
  tools[7]!,
  tools[3]!,
  tools[6]!,
  tools[2]!,
]

/** Home "人气榜单" period sets, mirroring the prototype ordering. */
export const rankSets: Record<string, Tool[]> = {
  日榜: tools.slice(0, 10),
  周榜: [tools[1]!, tools[0]!, tools[3]!, tools[5]!, tools[2]!, tools[9]!, tools[10]!, tools[4]!, tools[12]!, tools[20]!],
  月榜: [tools[0]!, tools[2]!, tools[5]!, tools[3]!, tools[4]!, tools[12]!, tools[15]!, tools[9]!, tools[20]!, tools[23]!],
}

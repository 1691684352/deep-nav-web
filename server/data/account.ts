import type { FavoriteItem, HistoryItem, Submission, User } from '#shared/types'
import { toolBySlug } from './tools'

export const demoUser: User = {
  id: 'user-001',
  nickname: '深度用户',
  avatar: '/assets/avatar-default.png',
  level: 3,
  levelLabel: 'Lv.3',
  phone: '188****6688',
  joinedAt: '2025-10-04',
  location: '中国 · 杭州',
  bio: '欢迎回来，探索更多优质工具，让效率触手可及。',
}

function favorite(slug: string, createdAt: string): FavoriteItem {
  const tool = toolBySlug.get(slug)!
  return {
    toolSlug: tool.slug,
    name: tool.name,
    desc: tool.desc,
    domain: tool.domain,
    url: tool.url,
    category: tool.category,
    createdAt,
  }
}

function history(slug: string, visitedAt: string): HistoryItem {
  const tool = toolBySlug.get(slug)!
  return {
    toolSlug: tool.slug,
    name: tool.name,
    desc: tool.desc,
    domain: tool.domain,
    url: tool.url,
    category: tool.category,
    visitedAt,
  }
}

/** Seed rows shown right after the demo login. */
export const defaultFavorites: FavoriteItem[] = [
  favorite('deepseek', '2026-01-30 09:12'),
  favorite('trae', '2026-01-29 21:40'),
  favorite('figma', '2026-01-28 16:05'),
  favorite('notion-ai', '2026-01-27 10:22'),
  favorite('midjourney', '2026-01-26 20:11'),
  favorite('coze', '2026-01-25 14:38'),
]

export const defaultHistory: HistoryItem[] = [
  history('chatgpt', '2026-02-01 08:45'),
  history('jimeng', '2026-01-31 22:17'),
  history('kimi', '2026-01-31 15:03'),
  history('canva', '2026-01-30 19:26'),
  history('cursor', '2026-01-30 11:54'),
]

const submissionBase = {
  icon: '',
  language: '中文',
  contactName: '深度用户',
  contactEmail: 'author@example.com',
  contactWechat: 'deepnav_author',
  remark: '',
  agreement: true,
}

export const defaultSubmissions: Submission[] = [
  {
    ...submissionBase,
    id: 'submission-001',
    name: 'AI 智能写作助手',
    url: 'https://ai-writer.example.com',
    slogan: '一句话生成完整文章',
    description: '面向自媒体作者的智能写作工具，支持选题建议、成文与配图。',
    categorySlug: 'ai',
    navCategorySlug: 'ai-office',
    tags: ['AI 写作', '内容创作'],
    status: 'review',
    statusLabel: '审核中',
    category: 'AI工具',
    submittedAt: '2024-07-12 14:30',
    updatedAt: '2024-07-12 14:30',
  },
  {
    ...submissionBase,
    id: 'submission-002',
    name: '数据可视化图表工具',
    url: 'https://charts.example.com',
    slogan: '把表格变成会说话的图表',
    description: '在线图表制作工具，内置多种业务模板，支持一键导出。',
    categorySlug: 'productivity',
    navCategorySlug: 'ai-office',
    tags: ['数据可视化', '效率工具'],
    status: 'approved',
    statusLabel: '已通过',
    category: '效率工具',
    submittedAt: '2024-07-10 09:15',
    updatedAt: '2024-07-11 10:02',
  },
  {
    ...submissionBase,
    id: 'submission-003',
    name: '在线思维导图',
    url: 'https://mindmap.example.com',
    slogan: '随手记录，结构自动生成',
    description: '轻量的在线思维导图工具，支持协作编辑与多格式导出。',
    categorySlug: 'education',
    navCategorySlug: 'ai-office',
    tags: ['思维导图', '学习教育'],
    status: 'rejected',
    statusLabel: '已拒绝',
    category: '学习教育',
    submittedAt: '2024-07-08 16:45',
    updatedAt: '2024-07-09 08:30',
  },
]

export const submissionStatusLabels: Record<Submission['status'], string> = {
  review: '审核中',
  approved: '已通过',
  rejected: '已拒绝',
}

/** Counters shown on the personal-center dashboard. */
export const profileBaseCounts = {
  favorites: 128,
  history: 24,
  submissions: 8,
  feedback: 5,
}

export const profileNavItems = [
  { key: 'overview', label: '个人中心', icon: 'house', to: '/profile' },
  { key: 'favorites', label: '我的收藏', icon: 'star', to: '/profile/favorites' },
  { key: 'history', label: '最近使用', icon: 'history', to: '/profile/history' },
  { key: 'submissions', label: '我的投稿', icon: 'inbox', to: '/profile/submissions' },
  { key: 'feedback', label: '我的反馈', icon: 'message-square-text', to: '/profile/feedback' },
  { key: 'messages', label: '消息通知', icon: 'bell', to: '/profile/messages' },
  { key: 'settings', label: '账号设置', icon: 'settings-2', to: '/profile/settings' },
]

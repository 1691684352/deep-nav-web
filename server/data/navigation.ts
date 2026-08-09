import type { FooterColumn, FooterFollow, NavLink } from '#shared/types'
import { staticPageBySlug } from './pages'
import { categoryBySlug, navCategoryBySlug } from './taxonomy'
import { topicBySlug } from './topics'

/**
 * Authoring format for navigation entries. Everything except a plain `page`
 * entry is resolved against the catalog at request time, so renaming a category
 * or retiring a topic never leaves a dead link in the header.
 */
export type NavSource =
  | { id: string, kind: 'page', label: string, to: string, badge?: string, icon?: string, match?: string[] }
  | { id: string, kind: 'category', slug: string, label?: string, badge?: string, icon?: string, match?: string[] }
  | { id: string, kind: 'subcategory', slug: string, label?: string, badge?: string, icon?: string, match?: string[] }
  | { id: string, kind: 'topic', slug: string, label?: string, badge?: string, icon?: string, match?: string[] }
  | { id: string, kind: 'external', label: string, url: string, badge?: string, icon?: string, rel?: string }

const headerNavSource: NavSource[] = [
  { id: 'home', kind: 'page', label: '首页', to: '/' },
  // Detail and search pages belong to the browsing flow, so they keep this lit.
  { id: 'ai-nav', kind: 'category', slug: 'ai', label: 'AI 导航', match: ['/category', '/tool', '/search'] },
  { id: 'ranking', kind: 'page', label: '排行榜', to: '/ranking' },
  { id: 'topic', kind: 'page', label: '精选专题', to: '/topic' },
  { id: 'submit', kind: 'page', label: '投稿/收录', to: '/submit', badge: 'NEW' },
]

export function resolveNavLink(item: NavSource): NavLink | null {
  const base = { id: item.id, badge: item.badge, icon: item.icon }

  switch (item.kind) {
    case 'page': {
      const slug = item.to.replace(/^\/about\/?/, '')
      if (item.to.startsWith('/about') && !staticPageBySlug.has(slug || 'index')) return null
      return { ...base, kind: 'page', label: item.label, to: item.to, match: item.match }
    }
    case 'category': {
      const category = categoryBySlug.get(item.slug)
      if (!category) return null
      return { ...base, kind: 'category', label: item.label ?? category.label, to: `/category/${category.slug}`, match: item.match }
    }
    case 'subcategory': {
      const nav = navCategoryBySlug.get(item.slug)
      if (!nav) return null
      return { ...base, kind: 'subcategory', label: item.label ?? nav.label, to: `/category/subcategory/${nav.slug}`, match: item.match }
    }
    case 'topic': {
      const topic = topicBySlug.get(item.slug)
      if (!topic) return null
      return { ...base, kind: 'topic', label: item.label ?? topic.title, to: `/topic/${topic.slug}`, match: item.match }
    }
    case 'external':
      return { ...base, kind: 'external', label: item.label, to: item.url, target: '_blank', rel: item.rel ?? 'noopener noreferrer' }
  }
}

/** Entries pointing at content that no longer exists are dropped, not rendered broken. */
export function resolveNavLinks(source: NavSource[]): NavLink[] {
  return source.map(resolveNavLink).filter((link): link is NavLink => link !== null)
}

export const headerNav = resolveNavLinks(headerNavSource)

const footerColumnSource: Array<{ title: string, links: NavSource[] }> = [
  {
    title: '导航',
    links: [
      { id: 'footer-home', kind: 'page', label: '首页', to: '/' },
      { id: 'footer-ai', kind: 'category', slug: 'ai', label: 'AI 导航' },
      { id: 'footer-ranking', kind: 'page', label: '排行榜', to: '/ranking' },
      { id: 'footer-topic', kind: 'page', label: '精选专题', to: '/topic' },
    ],
  },
  {
    title: '服务',
    links: [
      { id: 'footer-submit', kind: 'page', label: '提交收录', to: '/submit' },
      { id: 'footer-ads', kind: 'page', label: '广告合作', to: '/about/advertising' },
      { id: 'footer-api', kind: 'page', label: 'API 接口', to: '/about/api' },
      { id: 'footer-help', kind: 'page', label: '帮助中心', to: '/about/help' },
    ],
  },
  {
    title: '关于',
    links: [
      { id: 'footer-about', kind: 'page', label: '关于我们', to: '/about' },
      { id: 'footer-contact', kind: 'page', label: '联系我们', to: '/about/contact' },
      { id: 'footer-disclaimer', kind: 'page', label: '免责声明', to: '/about/disclaimer' },
      { id: 'footer-privacy', kind: 'page', label: '隐私政策', to: '/about/privacy' },
    ],
  },
]

const footerSocialSource: NavSource[] = [
  { id: 'social-weibo', kind: 'page', label: '微博', to: '/about/contact', icon: 'at-sign' },
  { id: 'social-wechat', kind: 'page', label: '公众号', to: '/about/contact', icon: 'message-circle' },
  { id: 'social-community', kind: 'page', label: '社区', to: '/about/contact', icon: 'users' },
]

function qrImage(payload: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=0&data=${payload}`
}

/** Columns whose links all resolved away are dropped so the grid never renders a bare heading. */
export const footerColumns: FooterColumn[] = footerColumnSource
  .map(column => ({ title: column.title, links: resolveNavLinks(column.links) }))
  .filter(column => column.links.length > 0)

export const footerSocials = resolveNavLinks(footerSocialSource)

export const footerFollow: FooterFollow = {
  title: '关注 · 关注我们',
  qrCodes: [
    { id: 'qr-official', label: '微信公众号', image: qrImage('deep-nav-wechat-official') },
    { id: 'qr-miniprogram', label: '官方小程序', image: qrImage('deep-nav-miniprogram') },
  ],
}

const friendLinkSource: NavSource[] = [
  '懂AI',
  'AIHub工具导航',
  '映妙派',
  'AIGC工具导航',
  '全灵AI写作',
  '工具达人',
  'AI时代',
  'AI工具箱',
  '一糖导航',
  'AI工具导航',
  'UIED',
  'AI生产力工具',
].map((label, index) => ({
  id: `friend-${index + 1}`,
  kind: 'external' as const,
  label,
  url: 'https://www.deepnav.cn',
  rel: 'noopener nofollow',
}))

const serviceLinkSource: NavSource[] = [
  { id: 'service-terms', kind: 'page', label: '使用协议', to: '/about/terms' },
  { id: 'service-privacy', kind: 'page', label: '隐私政策', to: '/about/privacy' },
  { id: 'service-ads', kind: 'page', label: '广告服务', to: '/about/advertising' },
]

const beianLinkSource: NavSource[] = [
  { id: 'beian-icp', kind: 'page', label: 'ICP备案', to: '/about' },
  { id: 'beian-police', kind: 'page', label: '公安备案', to: '/about' },
]

export const railFriendLinks = resolveNavLinks(friendLinkSource)
export const railServiceLinks = resolveNavLinks(serviceLinkSource)
export const railBeianLinks = resolveNavLinks(beianLinkSource)
export const railWechatQr = qrImage('deep-nav-wechat')

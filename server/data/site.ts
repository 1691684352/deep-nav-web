import type { FeatureCard, SeoMeta, SiteConfig } from '#shared/types'
import {
  footerColumns,
  footerFollow,
  footerSocials,
  headerNav,
  railBeianLinks,
  railFriendLinks,
  railServiceLinks,
  railWechatQr,
} from './navigation'

const email = 'service@deepnav.cn'

export const siteConfig: SiteConfig = {
  name: '深度指引',
  slogan: '发现优质网站和工具，提升工作效率，探索无限可能。',
  description: '深度指引收录优质网站和工具，助力你的高效工作与学习。',
  email,
  copyright: '© 2026 深度指引 · 精选互联网优质工具与资源',
  headerNav,
  footerColumns,
  footerSocials,
  footerFollow,
  rail: {
    recommend: { title: '推荐工具', badge: '精选' },
    promo: {
      title: 'AI 导航合集',
      subtitle: '精选 100+ AI 工具',
      ctaLabel: '探索更多',
      to: '/category/ai',
    },
    wechat: {
      title: '关注微信公众号',
      descriptions: ['最新AI工具、AI资讯', '独家AI资源、AI项目落地'],
      qr: railWechatQr,
      caption: '微信扫一扫关注公众号',
    },
    friendLinks: {
      title: '友情链接',
      actionLabel: '交换友链',
      actionTo: '/submit',
      links: railFriendLinks,
    },
    meta: {
      serviceLinks: railServiceLinks,
      contactLabel: '投诉举报邮箱：',
      email,
      copyright: '© 2026 深度指引',
      beianLinks: railBeianLinks,
    },
  },
  hotKeywords: ['ChatGPT', 'Midjourney', 'PPT 模板', '文心一言', 'Notion', 'Figma'],
  globalSearchKeywords: [
    { label: 'ChatGPT', value: 'ChatGPT' },
    { label: 'AI 图像', value: 'AI图像' },
    { label: 'AI 办公', value: 'AI办公' },
    { label: '开发技术', value: '开发技术' },
  ],
}

/** Four promoted media cards below the hero. */
export const featureCards: FeatureCard[] = [
  { id: 'feature-vebase', name: 'Vebase', description: '你的 AI Agent 团队', background: '/assets/vebase-bg.png', logo: '/assets/vebase-logo.png', to: '/tool/vebase' },
  { id: 'feature-trae', name: 'TRAE 编程', description: 'AI 辅助编程，代码自动修复', background: '/assets/trae-bg.png', logo: '/assets/trae-logo.png', to: '/tool/trae' },
  { id: 'feature-qoder', name: 'QoderWork', description: '阿里 Qoder 团队推出的桌面工具', background: '/assets/qoder-bg.png', logo: '/assets/qoder-logo.png', to: '/tool/qoderwork' },
  { id: 'feature-jimeng', name: '即梦 AI', description: '一站式 AI 创作平台', background: '/assets/jimeng-bg.jpg', logo: '/assets/jimeng-logo.png', to: '/tool/jimeng' },
]

const ogImage = '/assets/deepseek-site-preview.png'

/** Page-level SEO the backend can override without touching the frontend. */
export const seoPresets: Record<string, SeoMeta> = {
  home: {
    title: '深度指引 - 发现优质网站和工具',
    description: '深度指引收录优质 AI 工具、效率应用与设计资源，按分类、榜单与专题帮助你快速找到合适的网站。',
    keywords: 'AI导航,AI工具,网址导航,效率工具,设计资源,深度指引',
    ogType: 'website',
    ogImage,
  },
  category: {
    title: 'AI 工具分类导航 - 深度指引',
    description: '按 AI 对话、AI 绘画、AI 视频、AI 办公等场景浏览分类工具，快速定位适合的产品。',
    keywords: 'AI分类,AI工具导航,AI绘画,AI视频,AI办公',
    ogType: 'website',
    ogImage,
  },
  ranking: {
    title: '工具热度排行榜 - 深度指引',
    description: '实时统计全站工具热度，提供日榜、周榜、月榜与年度榜单，掌握当下最受关注的产品。',
    keywords: 'AI排行榜,工具榜单,热度排行,深度指引',
    ogType: 'website',
    ogImage,
  },
  topic: {
    title: '精选专题 - 深度指引',
    description: '深度指引精选专题，按使用场景发现优质工具合集。',
    keywords: 'AI专题,工具合集,场景化导航',
    ogType: 'website',
    ogImage,
  },
  search: {
    title: '搜索结果 - 深度指引',
    description: '在深度指引中搜索工具、网站与资源，支持分类筛选与热度排序。',
    keywords: '工具搜索,AI搜索,网址搜索',
    ogType: 'website',
    robots: 'noindex, follow',
    ogImage,
  },
  submit: {
    title: '提交收录 - 深度指引',
    description: '提交你的网站或工具，通过审核后即可出现在深度指引的分类与榜单中。',
    keywords: '网站收录,工具投稿,提交收录',
    ogType: 'website',
    ogImage,
  },
  profile: {
    title: '个人中心 - 深度指引',
    description: '查看收藏、浏览记录与投稿状态，管理你的深度指引账号。',
    keywords: '个人中心,我的收藏,浏览记录',
    ogType: 'website',
    robots: 'noindex, nofollow',
    ogImage,
  },
  notFound: {
    title: '页面不存在 - 深度指引',
    description: '你访问的页面不存在或已被移动，返回首页继续探索优质工具。',
    ogType: 'website',
    robots: 'noindex, follow',
    ogImage,
  },
}

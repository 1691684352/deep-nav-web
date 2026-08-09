/**
 * Contract shared by the Nitro mock API and the Nuxt application.
 * A real backend only has to reproduce these shapes.
 */

export interface ApiResult<T> {
  code: number
  message: string
  data: T
  timestamp: number
}

export interface PageQuery {
  page?: number
  pageSize?: number
}

export interface PageResult<T> {
  list: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface SeoMeta {
  title: string
  description: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: string
  canonical?: string
  robots?: string
}

/* -------------------------------------------------------------------------- */
/* Taxonomy                                                                    */
/* -------------------------------------------------------------------------- */

export interface Category {
  /** Stable URL segment, e.g. `ai`. */
  slug: string
  /** Display name used by the prototype, e.g. `AI工具`. */
  name: string
  /** Label rendered in the sidebar, e.g. `AI 工具`. */
  label: string
  icon: string
  description: string
  toolCount: number
}

export interface NavCategory {
  slug: string
  name: string
  label: string
  title: string
  description: string
  icon: string
  toolCount?: number
}

export interface CategoryGroup extends NavCategory {
  /** Total matches, which can exceed the previewed `tools` length. */
  total: number
  tools: Tool[]
}

/* -------------------------------------------------------------------------- */
/* Tools                                                                       */
/* -------------------------------------------------------------------------- */

export interface Tool {
  id: string
  slug: string
  name: string
  desc: string
  category: string
  categorySlug: string
  navCategory: string
  navCategorySlug: string
  domain: string
  url: string
  /** Display heat, e.g. `98.7k`. */
  heat: string
  /** Numeric heat used for sorting. */
  heatValue: number
  verified: boolean
  tags: string[]
  createdAt: string
}

export interface LatestTool {
  id: string
  slug: string
  name: string
  category: string
  desc: string
  time: string
  gain: string
  domain: string
  url: string
}

export interface ToolFeature {
  icon: string
  title: string
  description: string
}

export interface ToolScreenshot {
  src: string
  alt: string
  width: number
  height: number
}

export interface ToolStat {
  value: string
  label: string
}

export interface Review {
  id: string
  toolSlug: string
  author: string
  avatarText: string
  rating: number
  content: string
  createdAt: string
  likes: number
}

export interface RatingBucket {
  score: number
  count: number
}

export interface ToolNews {
  id: string
  title: string
  source: string
  publishedAt: string
  url: string
}

export interface ToolGallery {
  main: ToolScreenshot
  thumbs: ToolScreenshot[]
  extra: ToolScreenshot[]
}

export interface Breadcrumb {
  label: string
  to?: string
}

export interface ToolDetail extends Tool {
  slogan: string
  siteTags: string[]
  stats: ToolStat[]
  /** `null` when the tool has no curated screenshots yet. */
  gallery: ToolGallery | null
  /** Markdown body rendered inside `.detail-prose`. */
  overview: string
  features: ToolFeature[]
  breadcrumbs: Breadcrumb[]
  rating: number
  ratingCount: number
  ratingBuckets: RatingBucket[]
  reviews: Review[]
  news: ToolNews[]
  related: Tool[]
}

/* -------------------------------------------------------------------------- */
/* Topics                                                                      */
/* -------------------------------------------------------------------------- */

export interface Topic {
  id: string
  slug: string
  title: string
  description: string
  /** Domains used to render the stacked favicon row. */
  icons: string[]
  toolCount: number
  /** Prototype highlights a few cards with the indigo palette. */
  accent: 'indigo' | 'neutral' | 'slate' | 'blue'
  categorySlug: string
  navCategorySlug?: string
}

export interface TopicDetail extends Topic {
  intro: string
  tools: Tool[]
  related: Topic[]
}

/* -------------------------------------------------------------------------- */
/* Ranking                                                                     */
/* -------------------------------------------------------------------------- */

export type RankingPeriod = '日榜' | '周榜' | '月榜' | '年度'

export interface RankingEntry {
  rank: number
  tool: Tool
  /** Period-scoped heat score used for ordering. */
  score: number
  heat: string
  /** Positions gained (positive) or lost (negative) versus the previous run. */
  change: number
  /** Heat delta rendered next to the trend arrow, e.g. `12.5`. */
  changePercent: number
  trend: 'up' | 'down' | 'flat'
  /** Width of the heat bar, 0-100. */
  heatPercent: number
}

export interface RankingResult {
  period: RankingPeriod
  periodLabel: string
  category: string
  summary: string
  podium: RankingEntry[]
  entries: RankingEntry[]
  total: number
  updatedAt: string
}

export interface CategoryRankingItem {
  category: string
  categorySlug: string
  icon: string
  topTool: Tool
}

export interface RisingRankingItem {
  rank: number
  tool: Tool
  growth: number
}

/* -------------------------------------------------------------------------- */
/* Search                                                                      */
/* -------------------------------------------------------------------------- */

export type SearchSort = 'heat' | 'newest' | 'name'

export interface SearchItem extends Tool {
  /** Secondary line rendered under the result title. */
  meta: string
}

export interface SearchFacet {
  slug: string
  label: string
  count: number
}

export interface SearchResult extends PageResult<SearchItem> {
  keyword: string
  categorySlug: string
  facets: SearchFacet[]
  sort: SearchSort
}

/* -------------------------------------------------------------------------- */
/* Account                                                                     */
/* -------------------------------------------------------------------------- */

export interface User {
  id: string
  nickname: string
  avatar: string
  level: number
  levelLabel: string
  phone: string
  joinedAt: string
  location: string
  bio: string
}

export interface AuthSession {
  token: string
  user: User
}

export interface FavoriteItem {
  toolSlug: string
  name: string
  desc: string
  domain: string
  url: string
  category: string
  createdAt: string
}

export interface HistoryItem {
  toolSlug: string
  name: string
  desc: string
  domain: string
  url: string
  category: string
  visitedAt: string
}

export type SubmissionStatus = 'review' | 'approved' | 'rejected'

export interface SubmissionForm {
  name: string
  url: string
  icon: string
  categorySlug: string
  navCategorySlug: string
  language: string
  slogan: string
  description: string
  tags: string[]
  contactName: string
  contactEmail: string
  contactWechat: string
  remark: string
  agreement: boolean
}

export interface Submission extends SubmissionForm {
  id: string
  status: SubmissionStatus
  statusLabel: string
  category: string
  submittedAt: string
  updatedAt: string
}

export interface SubmissionDraft extends Partial<SubmissionForm> {
  savedAt: string
  step: number
}

export interface ProfileStat {
  key: string
  label: string
  value: number
  icon: string
  to: string
}

export interface ProfileOverview {
  user: User
  stats: ProfileStat[]
  favorites: FavoriteItem[]
  history: HistoryItem[]
  submissions: Submission[]
}

/* -------------------------------------------------------------------------- */
/* Site configuration                                                          */
/* -------------------------------------------------------------------------- */

export interface FeatureCard {
  id: string
  name: string
  description: string
  background: string
  logo: string
  to: string
}

/** What a navigation entry points at, so the UI knows how to render it. */
export type NavLinkKind = 'page' | 'category' | 'subcategory' | 'topic' | 'external'

export interface NavLink {
  id: string
  label: string
  /** Resolved destination: an internal route, or an absolute URL when external. */
  to: string
  kind: NavLinkKind
  badge?: string
  /** Lucide icon name, used by icon-only entries such as the footer socials. */
  icon?: string
  /** Extra path prefixes that should also light up this link. */
  match?: string[]
  target?: '_blank'
  rel?: string
}

export interface FooterColumn {
  title: string
  links: NavLink[]
}

export interface QrCode {
  id: string
  label: string
  image: string
}

export interface FooterFollow {
  title: string
  qrCodes: QrCode[]
}

/** A titled group of links, optionally with a call-to-action beside the title. */
export interface LinkSection {
  title: string
  actionLabel?: string
  actionTo?: string
  links: NavLink[]
}

export interface PromoBanner {
  title: string
  subtitle: string
  ctaLabel: string
  to: string
}

export interface WechatCard {
  title: string
  descriptions: string[]
  qr: string
  caption: string
}

export interface SiteMetaCard {
  serviceLinks: NavLink[]
  contactLabel: string
  email: string
  copyright: string
  beianLinks: NavLink[]
}

/** Everything the right-hand rail renders below the account card. */
export interface SiteRail {
  recommend: { title: string, badge?: string }
  promo: PromoBanner
  wechat: WechatCard
  friendLinks: LinkSection
  meta: SiteMetaCard
}

export interface SiteConfig {
  name: string
  slogan: string
  description: string
  email: string
  copyright: string
  headerNav: NavLink[]
  footerColumns: FooterColumn[]
  footerSocials: NavLink[]
  footerFollow: FooterFollow
  rail: SiteRail
  hotKeywords: string[]
  globalSearchKeywords: Array<{ label: string, value: string }>
}

export interface HomeGreeting {
  eyebrow: string
  title: string
  subtitle: string
}

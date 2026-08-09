import { staticPages } from '../../data/pages'
import { categories, navCategories } from '../../data/taxonomy'
import { topics } from '../../data/topics'

export default defineSitemapEventHandler(() => [
  { loc: '/', changefreq: 'daily' as const, priority: 1 as const },
  { loc: '/ranking', changefreq: 'daily' as const, priority: 0.9 as const },
  { loc: '/topic', changefreq: 'weekly' as const, priority: 0.8 as const },
  { loc: '/submit', changefreq: 'monthly' as const, priority: 0.5 as const },
  ...categories.map(category => ({
    loc: `/category/${category.slug}`,
    changefreq: 'weekly' as const,
    priority: 0.8 as const,
  })),
  ...navCategories.map(nav => ({
    loc: `/category/subcategory/${nav.slug}`,
    changefreq: 'weekly' as const,
    priority: 0.7 as const,
  })),
  ...topics.map(topic => ({
    loc: `/topic/${topic.slug}`,
    changefreq: 'weekly' as const,
    priority: 0.7 as const,
  })),
  ...staticPages.map(page => ({
    loc: page.slug === 'index' ? '/about' : `/about/${page.slug}`,
    changefreq: 'monthly' as const,
    priority: 0.4 as const,
    lastmod: page.updatedAt,
  })),
  ...catalog.map(tool => ({
    loc: `/tool/${tool.slug}`,
    changefreq: 'weekly' as const,
    priority: 0.6 as const,
    lastmod: tool.createdAt,
  })),
])

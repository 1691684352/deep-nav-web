import type { Category, FeatureCard, NavCategory, SiteConfig, Tool } from '#shared/types'
import { defineStore } from 'pinia'

interface SiteConfigPayload {
  site: SiteConfig
  featureCards: FeatureCard[]
  recommendedTools: Tool[]
  categories: Category[]
  navCategories: NavCategory[]
}

/** Global chrome data (nav, footer, taxonomy) fetched once per session. */
export const useSiteStore = defineStore('site', () => {
  const site = ref<SiteConfig | null>(null)
  const featureCards = ref<FeatureCard[]>([])
  const recommendedTools = ref<Tool[]>([])
  const categories = ref<Category[]>([])
  const navCategories = ref<NavCategory[]>([])
  const loaded = ref(false)

  function hydrate(payload: Partial<SiteConfigPayload>) {
    if (payload.site) site.value = payload.site
    if (payload.featureCards) featureCards.value = payload.featureCards
    if (payload.recommendedTools) recommendedTools.value = payload.recommendedTools
    if (payload.categories) categories.value = payload.categories
    if (payload.navCategories) navCategories.value = payload.navCategories
    loaded.value = Boolean(site.value)
  }

  async function ensure(): Promise<boolean> {
    if (loaded.value) return true
    const payload = await $api<SiteConfigPayload>('/api/site/config')
    hydrate(payload)
    return loaded.value
  }

  return { site, featureCards, recommendedTools, categories, navCategories, loaded, hydrate, ensure }
})

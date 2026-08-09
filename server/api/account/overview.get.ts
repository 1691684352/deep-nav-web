import { defaultFavorites, defaultHistory, defaultSubmissions, demoUser, profileBaseCounts, profileNavItems } from '../../data/account'
import { seoPresets } from '../../data/site'

export default defineEventHandler(() => ok({
  seo: { ...seoPresets.profile, canonical: '/profile' },
  user: demoUser,
  navItems: profileNavItems,
  baseCounts: profileBaseCounts,
  favorites: defaultFavorites,
  history: defaultHistory,
  submissions: defaultSubmissions,
}))

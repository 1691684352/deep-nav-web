import { useAccountStore } from '~/stores/account'

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/profile')) return
  const account = useAccountStore()
  const loggedIn = await account.restoreSession()
  if (!loggedIn) return navigateTo({ path: '/', query: { login: '1' } })
})

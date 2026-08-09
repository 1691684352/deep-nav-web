import type {
  AccountSnapshot,
  FavoriteItem,
  HistoryItem,
  LoginPayload,
  Review,
  SessionPayload,
  Submission,
  SubmissionDraft,
  Tool,
  User,
} from '#shared/types'
import { defineStore } from 'pinia'

export const useAccountStore = defineStore('account', () => {
  const user = ref<User | null>(null)
  const favorites = ref<FavoriteItem[]>([])
  const history = ref<HistoryItem[]>([])
  const submissions = ref<Submission[]>([])
  const draft = ref<SubmissionDraft | null>(null)
  const myReviews = ref<Review[]>([])
  const initialized = ref(false)

  const isLoggedIn = computed(() => Boolean(user.value))
  const favoriteSlugs = computed(() => new Set(favorites.value.map(item => item.toolSlug)))

  function applyAccount(account: AccountSnapshot) {
    user.value = account.user
    favorites.value = account.favorites
    history.value = account.history
    submissions.value = account.submissions
    draft.value = account.draft
    myReviews.value = account.reviews
    initialized.value = true
  }

  function reset() {
    user.value = null
    favorites.value = []
    history.value = []
    submissions.value = []
    draft.value = null
    myReviews.value = []
    initialized.value = true
  }

  function applyLogin(payload: LoginPayload) {
    applyAccount(payload.account)
  }

  async function restoreSession() {
    if (initialized.value) return isLoggedIn.value
    try {
      const payload = await $api<SessionPayload>('/api/auth/session')
      if (payload.authenticated && payload.account) applyAccount(payload.account)
      else reset()
    }
    catch {
      reset()
    }
    return isLoggedIn.value
  }

  async function logout() {
    try {
      await $api('/api/auth/logout', { method: 'POST' })
    }
    finally {
      reset()
    }
  }

  function isFavorite(slug: string) {
    return favoriteSlugs.value.has(slug)
  }

  async function toggleFavorite(tool: Tool | FavoriteItem): Promise<boolean> {
    const toolSlug = 'toolSlug' in tool ? tool.toolSlug : tool.slug
    const payload = await $api<{ favorite: boolean, favorites: FavoriteItem[] }>('/api/account/favorites', {
      method: 'POST',
      body: { toolSlug },
    })
    favorites.value = payload.favorites
    return payload.favorite
  }

  async function removeFavorite(slug: string) {
    favorites.value = await $api<FavoriteItem[]>(`/api/account/favorites/${encodeURIComponent(slug)}`, { method: 'DELETE' })
  }

  async function clearFavorites() {
    favorites.value = await $api<FavoriteItem[]>('/api/account/favorites', { method: 'DELETE' })
  }

  async function recordHistory(tool: Tool) {
    if (!isLoggedIn.value) return
    history.value = await $api<HistoryItem[]>('/api/account/history', {
      method: 'POST',
      body: { toolSlug: tool.slug },
    })
  }

  async function removeHistory(slug: string) {
    history.value = await $api<HistoryItem[]>(`/api/account/history/${encodeURIComponent(slug)}`, { method: 'DELETE' })
  }

  async function clearHistory() {
    history.value = await $api<HistoryItem[]>('/api/account/history', { method: 'DELETE' })
  }

  function addSubmission(submission: Submission) {
    submissions.value = [submission, ...submissions.value.filter(item => item.id !== submission.id)]
  }

  async function removeSubmission(id: string) {
    submissions.value = await $api<Submission[]>(`/api/account/submissions/${encodeURIComponent(id)}`, { method: 'DELETE' })
  }

  async function saveDraft(value: SubmissionDraft) {
    draft.value = await $api<SubmissionDraft>('/api/account/draft', { method: 'PUT', body: value })
  }

  async function clearDraft() {
    await $api('/api/account/draft', { method: 'DELETE' })
    draft.value = null
  }

  function addReview(review: Review) {
    myReviews.value = [review, ...myReviews.value.filter(item => item.id !== review.id)]
  }

  function reviewsFor(slug: string) {
    return myReviews.value.filter(item => item.toolSlug === slug)
  }

  async function updateProfile(profile: Pick<User, 'nickname' | 'bio' | 'location'>) {
    user.value = await $api<User>('/api/account/profile', { method: 'PATCH', body: profile })
  }

  async function clearActivityData() {
    const account = await $api<AccountSnapshot>('/api/account/data', { method: 'DELETE' })
    applyAccount(account)
  }

  return {
    user,
    favorites,
    history,
    submissions,
    draft,
    myReviews,
    initialized,
    isLoggedIn,
    favoriteSlugs,
    applyLogin,
    restoreSession,
    logout,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
    recordHistory,
    removeHistory,
    clearHistory,
    addSubmission,
    removeSubmission,
    saveDraft,
    clearDraft,
    addReview,
    reviewsFor,
    updateProfile,
    clearActivityData,
  }
})

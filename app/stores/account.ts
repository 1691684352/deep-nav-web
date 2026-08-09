import type {
  AuthSession,
  FavoriteItem,
  HistoryItem,
  Review,
  Submission,
  SubmissionDraft,
  Tool,
  User,
} from '#shared/types'
import { formatDateTime } from '#shared/utils'
import { defineStore, skipHydrate } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

interface LoginPayload {
  session: AuthSession
  favorites: FavoriteItem[]
  history: HistoryItem[]
  submissions: Submission[]
}

const STORAGE_KEY = 'deepNavAccount'
const HISTORY_LIMIT = 60

/**
 * Mock account state. Everything is persisted to localStorage so favourites,
 * history and submissions survive reloads exactly like a real backend session.
 */
export const useAccountStore = defineStore('account', () => {
  // `skipHydrate` keeps Pinia from overwriting these with the empty SSR snapshot,
  // which would wipe localStorage on every page load.
  const token = skipHydrate(useLocalStorage<string>(`${STORAGE_KEY}:token`, ''))
  const user = skipHydrate(useLocalStorage<User | null>(`${STORAGE_KEY}:user`, null, { serializer: jsonSerializer<User | null>(null) }))
  const favorites = skipHydrate(useLocalStorage<FavoriteItem[]>(`${STORAGE_KEY}:favorites`, [], { serializer: jsonSerializer<FavoriteItem[]>([]) }))
  const history = skipHydrate(useLocalStorage<HistoryItem[]>(`${STORAGE_KEY}:history`, [], { serializer: jsonSerializer<HistoryItem[]>([]) }))
  const submissions = skipHydrate(useLocalStorage<Submission[]>(`${STORAGE_KEY}:submissions`, [], { serializer: jsonSerializer<Submission[]>([]) }))
  const draft = skipHydrate(useLocalStorage<SubmissionDraft | null>(`${STORAGE_KEY}:draft`, null, { serializer: jsonSerializer<SubmissionDraft | null>(null) }))
  const myReviews = skipHydrate(useLocalStorage<Review[]>(`${STORAGE_KEY}:reviews`, [], { serializer: jsonSerializer<Review[]>([]) }))

  const isLoggedIn = computed(() => Boolean(token.value && user.value))
  const favoriteSlugs = computed(() => new Set(favorites.value.map(item => item.toolSlug)))

  function applyLogin(payload: LoginPayload) {
    token.value = payload.session.token
    user.value = payload.session.user
    if (!favorites.value.length) favorites.value = payload.favorites
    if (!history.value.length) history.value = payload.history
    if (!submissions.value.length) submissions.value = payload.submissions
  }

  function logout() {
    token.value = ''
    user.value = null
  }

  function isFavorite(slug: string) {
    return favoriteSlugs.value.has(slug)
  }

  /** Returns `true` when the tool ends up favourited. */
  function toggleFavorite(tool: Tool | FavoriteItem): boolean {
    const slug = 'toolSlug' in tool ? tool.toolSlug : tool.slug
    if (isFavorite(slug)) {
      favorites.value = favorites.value.filter(item => item.toolSlug !== slug)
      return false
    }
    const entry: FavoriteItem = 'toolSlug' in tool
      ? { ...tool, createdAt: formatDateTime(new Date()) }
      : {
          toolSlug: tool.slug,
          name: tool.name,
          desc: tool.desc,
          domain: tool.domain,
          url: tool.url,
          category: tool.category,
          createdAt: formatDateTime(new Date()),
        }
    favorites.value = [entry, ...favorites.value]
    return true
  }

  function removeFavorite(slug: string) {
    favorites.value = favorites.value.filter(item => item.toolSlug !== slug)
  }

  function clearFavorites() {
    favorites.value = []
  }

  function recordHistory(tool: Tool) {
    const entry: HistoryItem = {
      toolSlug: tool.slug,
      name: tool.name,
      desc: tool.desc,
      domain: tool.domain,
      url: tool.url,
      category: tool.category,
      visitedAt: formatDateTime(new Date()),
    }
    history.value = [entry, ...history.value.filter(item => item.toolSlug !== tool.slug)].slice(0, HISTORY_LIMIT)
  }

  function removeHistory(slug: string) {
    history.value = history.value.filter(item => item.toolSlug !== slug)
  }

  function clearHistory() {
    history.value = []
  }

  function addSubmission(submission: Submission) {
    submissions.value = [submission, ...submissions.value]
  }

  function removeSubmission(id: string) {
    submissions.value = submissions.value.filter(item => item.id !== id)
  }

  function saveDraft(value: SubmissionDraft) {
    draft.value = value
  }

  function clearDraft() {
    draft.value = null
  }

  function addReview(review: Review) {
    myReviews.value = [review, ...myReviews.value.filter(item => item.id !== review.id)]
  }

  function reviewsFor(slug: string) {
    return myReviews.value.filter(item => item.toolSlug === slug)
  }

  return {
    token,
    user,
    favorites,
    history,
    submissions,
    draft,
    myReviews,
    isLoggedIn,
    favoriteSlugs,
    applyLogin,
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
  }
})

/** `useLocalStorage` needs an explicit serializer for nullable object values. */
function jsonSerializer<T>(fallback: T) {
  return {
    read: (raw: string): T => {
      try {
        return raw ? (JSON.parse(raw) as T) : fallback
      }
      catch {
        return fallback
      }
    },
    write: (value: T) => JSON.stringify(value),
  }
}

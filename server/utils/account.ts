import type {
  AccountSnapshot,
  FavoriteItem,
  FeedbackRecord,
  HistoryItem,
  Review,
  Submission,
  SubmissionDraft,
  User,
} from '#shared/types'
import { formatDateTime } from '#shared/utils'
import type { H3Event } from 'h3'
import { defaultFavorites, defaultHistory, defaultSubmissions, demoUser } from '../data/account'

const SESSION_COOKIE = 'deep_nav_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 30
const HISTORY_LIMIT = 60

interface SessionRecord {
  userId: string
  expiresAt: number
}

interface AccountRecord extends AccountSnapshot {
  feedback: FeedbackRecord[]
}

const sessions = new Map<string, SessionRecord>()
const accounts = new Map<string, AccountRecord>()
const userIdByPhone = new Map<string, string>()

export function createSession(event: H3Event, phone: string) {
  const account = accountForPhone(phone)
  const sessionId = createId()
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000
  sessions.set(sessionId, { userId: account.user.id, expiresAt })
  setCookie(event, SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: getRequestProtocol(event) === 'https',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
  return {
    session: {
      user: clone(account.user),
      expiresAt: new Date(expiresAt).toISOString(),
    },
    account: snapshot(account),
  }
}

export function destroySession(event: H3Event) {
  const sessionId = getCookie(event, SESSION_COOKIE)
  if (sessionId) sessions.delete(sessionId)
  deleteCookie(event, SESSION_COOKIE, { path: '/' })
}

export function optionalAccount(event: H3Event): AccountRecord | null {
  const sessionId = getCookie(event, SESSION_COOKIE)
  if (!sessionId) return null
  const session = sessions.get(sessionId)
  if (!session || session.expiresAt <= Date.now()) {
    sessions.delete(sessionId)
    deleteCookie(event, SESSION_COOKIE, { path: '/' })
    return null
  }
  return accounts.get(session.userId) ?? null
}

export function requireAccount(event: H3Event): AccountRecord {
  const account = optionalAccount(event)
  if (!account) {
    throw createError({ statusCode: 401, statusMessage: '请先登录后再继续操作' })
  }
  return account
}

export function accountSnapshot(event: H3Event): AccountSnapshot {
  return snapshot(requireAccount(event))
}

export function replaceUser(account: AccountRecord, patch: Pick<User, 'nickname' | 'bio' | 'location'>) {
  account.user = { ...account.user, ...patch }
  return clone(account.user)
}

export function toggleFavoriteRecord(account: AccountRecord, item: FavoriteItem) {
  const exists = account.favorites.some(entry => entry.toolSlug === item.toolSlug)
  account.favorites = exists
    ? account.favorites.filter(entry => entry.toolSlug !== item.toolSlug)
    : [{ ...item, createdAt: formatDateTime(new Date()) }, ...account.favorites]
  return { favorite: !exists, favorites: clone(account.favorites) }
}

export function removeFavoriteRecord(account: AccountRecord, slug?: string) {
  account.favorites = slug
    ? account.favorites.filter(item => item.toolSlug !== slug)
    : []
  return clone(account.favorites)
}

export function recordHistoryItem(account: AccountRecord, item: HistoryItem) {
  const entry = { ...item, visitedAt: formatDateTime(new Date()) }
  account.history = [entry, ...account.history.filter(row => row.toolSlug !== item.toolSlug)].slice(0, HISTORY_LIMIT)
  return clone(account.history)
}

export function removeHistoryRecord(account: AccountRecord, slug?: string) {
  account.history = slug
    ? account.history.filter(item => item.toolSlug !== slug)
    : []
  return clone(account.history)
}

export function saveSubmissionRecord(account: AccountRecord, submission: Submission) {
  account.submissions = [submission, ...account.submissions.filter(item => item.id !== submission.id)]
  return clone(account.submissions)
}

export function withdrawSubmissionRecord(account: AccountRecord, id: string) {
  const submission = account.submissions.find(item => item.id === id)
  if (!submission) throw createError({ statusCode: 404, statusMessage: '投稿记录不存在' })
  if (submission.status !== 'review') {
    throw createError({ statusCode: 409, statusMessage: '仅审核中的投稿可以撤回' })
  }
  account.submissions = account.submissions.filter(item => item.id !== id)
  return clone(account.submissions)
}

export function saveDraftRecord(account: AccountRecord, draft: SubmissionDraft | null) {
  account.draft = draft ? clone(draft) : null
  return clone(account.draft)
}

export function saveReviewRecord(account: AccountRecord, review: Review) {
  account.reviews = [review, ...account.reviews.filter(item => item.id !== review.id)]
  return clone(account.reviews)
}

export function clearAccountData(account: AccountRecord) {
  account.favorites = []
  account.history = []
  account.draft = null
  return snapshot(account)
}

export function saveFeedbackRecord(account: AccountRecord, feedback: FeedbackRecord) {
  account.feedback = [feedback, ...account.feedback]
  return clone(feedback)
}

function accountForPhone(phone: string): AccountRecord {
  const existingUserId = userIdByPhone.get(phone)
  if (existingUserId) return accounts.get(existingUserId)!

  const userId = `user-${phone.slice(-4)}-${createId().slice(0, 8)}`
  const account: AccountRecord = {
    user: {
      ...clone(demoUser),
      id: userId,
      phone: `${phone.slice(0, 3)}****${phone.slice(-4)}`,
    },
    favorites: clone(defaultFavorites),
    history: clone(defaultHistory),
    submissions: clone(defaultSubmissions),
    draft: null,
    reviews: [],
    feedback: [],
  }
  accounts.set(userId, account)
  userIdByPhone.set(phone, userId)
  return account
}

function snapshot(account: AccountRecord): AccountSnapshot {
  return clone({
    user: account.user,
    favorites: account.favorites,
    history: account.history,
    submissions: account.submissions,
    draft: account.draft,
    reviews: account.reviews,
  })
}

function clone<T>(value: T): T {
  return structuredClone(value)
}

function createId() {
  return globalThis.crypto.randomUUID()
}

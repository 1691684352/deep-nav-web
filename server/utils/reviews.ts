import type { Review } from '#shared/types'
import { reviews as seedReviews } from '../data/tool-details'

const publishedReviews: Review[] = []
const likeOverrides = new Map<string, number>()
const likedUsers = new Map<string, Set<string>>()

export function publishReview(review: Review) {
  publishedReviews.unshift(structuredClone(review))
}

export function reviewsForTool(slug: string) {
  return [...publishedReviews, ...seedReviews]
    .filter(review => review.toolSlug === slug)
    .map(review => ({ ...review, likes: likeOverrides.get(review.id) ?? review.likes }))
}

export function publishedReviewsForTool(slug: string) {
  return publishedReviews.filter(review => review.toolSlug === slug)
}

export function likeReview(reviewId: string, toolSlug: string, userId: string) {
  const review = [...publishedReviews, ...seedReviews]
    .find(item => item.id === reviewId && item.toolSlug === toolSlug)
  if (!review) throw createError({ statusCode: 404, statusMessage: '评价不存在' })
  const users = likedUsers.get(reviewId) ?? new Set<string>()
  if (users.has(userId)) throw createError({ statusCode: 409, statusMessage: '你已经点赞过这条评价' })
  users.add(userId)
  likedUsers.set(reviewId, users)
  const likes = (likeOverrides.get(reviewId) ?? review.likes) + 1
  likeOverrides.set(reviewId, likes)
  return likes
}

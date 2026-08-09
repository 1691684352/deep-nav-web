import type { ApiResult, PageResult } from '#shared/types'

export function ok<T>(data: T, message = 'ok'): ApiResult<T> {
  return { code: 0, message, data, timestamp: Date.now() }
}

export function paginate<T>(list: T[], page = 1, pageSize = 20): PageResult<T> {
  const total = list.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(1, Math.trunc(page) || 1), totalPages)
  const start = (safePage - 1) * pageSize
  return {
    list: list.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    total,
    totalPages,
  }
}

export function toNumber(value: unknown, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function toStringParam(value: unknown, fallback = ''): string {
  if (Array.isArray(value)) return String(value[0] ?? fallback)
  return value === undefined || value === null ? fallback : String(value)
}

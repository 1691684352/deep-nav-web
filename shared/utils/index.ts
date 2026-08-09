/** Favicon endpoint used across cards, rows and search results. */
export function faviconUrl(domain: string, size = 128): string {
  return `/api/assets/favicon?domain=${encodeURIComponent(domain)}&size=${size}`
}

/** First character used as a logo fallback when the favicon fails to load. */
export function initialOf(name: string): string {
  return (name.trim().slice(0, 1) || '?').toUpperCase()
}

export function formatCompact(value: number): string {
  if (value >= 10000) return `${(value / 1000).toFixed(1)}k`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
  return String(value)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** `2026-02-01 09:12` in local time, matching the prototype's copy. */
export function formatDateTime(input: Date | string | number): string {
  const date = input instanceof Date ? input : new Date(input)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function relativeTime(input: Date | string | number): string {
  const date = input instanceof Date ? input : new Date(input)
  const diff = Date.now() - date.getTime()
  const minute = 60_000
  const hour = 60 * minute
  const day = 24 * hour
  if (diff < minute) return '刚刚'
  if (diff < hour) return `${Math.floor(diff / minute)} 分钟前`
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`
  if (diff < 30 * day) return `${Math.floor(diff / day)} 天前`
  return formatDateTime(date).slice(0, 10)
}

/** Greeting used by the home hero, mirroring the prototype's 下午好 copy. */
export function greetingFor(hour: number): string {
  if (hour < 5) return '凌晨好'
  if (hour < 11) return '早上好'
  if (hour < 13) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
}

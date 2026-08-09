import type { ApiResult } from '#shared/types'
import type { NitroFetchOptions } from 'nitropack'

/** Unwraps the `{ code, message, data }` envelope returned by every endpoint. */
export async function $api<T>(request: string, options: NitroFetchOptions<string> = {}): Promise<T> {
  const config = useRuntimeConfig()
  const requestHeaders = import.meta.server ? useRequestHeaders(['cookie']) : undefined
  const response = await $fetch<ApiResult<T>>(request, {
    baseURL: config.public.apiBase || undefined,
    credentials: 'include',
    headers: requestHeaders,
    ...options,
  } as never)
  return response.data
}

/** SSR-friendly `useAsyncData` wrapper that unwraps the API envelope. */
export function useApiData<T>(
  key: string,
  request: () => string,
  options: { watch?: any[], server?: boolean, lazy?: boolean, default?: () => T } = {},
) {
  return useAsyncData<T>(key, () => $api<T>(request()), options as never)
}

/** Extracts the human readable message from a Nitro error. */
export function apiErrorMessage(error: unknown, fallback = '请求失败，请稍后重试'): string {
  const candidate = error as { statusMessage?: string, data?: { statusMessage?: string, message?: string } }
  return candidate?.data?.statusMessage ?? candidate?.statusMessage ?? candidate?.data?.message ?? fallback
}

/** Field level errors returned by the submission endpoint. */
export function apiFieldErrors(error: unknown): Record<string, string> {
  const candidate = error as { data?: { data?: { errors?: Record<string, string> } } }
  return candidate?.data?.data?.errors ?? {}
}

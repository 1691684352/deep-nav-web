export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const domain = toStringParam(query.domain).trim().replace(/^https?:\/\//, '').split('/')[0]
  const size = Math.min(256, Math.max(16, Math.trunc(toNumber(query.size, 128))))
  if (!domain) return sendRedirect(event, '/favicon.ico', 302)

  try {
    const response = await fetch(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`)
    if (!response.ok) return sendRedirect(event, '/favicon.ico', 302)
    setResponseHeader(event, 'content-type', response.headers.get('content-type') ?? 'image/png')
    setResponseHeader(event, 'cache-control', 'public, max-age=86400, stale-while-revalidate=604800')
    return new Uint8Array(await response.arrayBuffer())
  }
  catch {
    return sendRedirect(event, '/favicon.ico', 302)
  }
})

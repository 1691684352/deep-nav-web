export default defineEventHandler((event) => {
  const account = optionalAccount(event)
  return ok({
    authenticated: Boolean(account),
    account: account ? accountSnapshot(event) : null,
  })
})

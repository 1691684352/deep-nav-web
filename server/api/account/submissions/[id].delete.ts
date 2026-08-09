export default defineEventHandler((event) => {
  const account = requireAccount(event)
  const id = getRouterParam(event, 'id') ?? ''
  return ok(withdrawSubmissionRecord(account, id), '投稿已撤回')
})

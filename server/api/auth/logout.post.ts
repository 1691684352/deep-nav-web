export default defineEventHandler((event) => {
  destroySession(event)
  return ok({ success: true }, '已退出登录')
})

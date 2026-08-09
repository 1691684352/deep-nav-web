export default defineEventHandler((event) => {
  return ok(removeHistoryRecord(requireAccount(event)), '已清空浏览历史')
})

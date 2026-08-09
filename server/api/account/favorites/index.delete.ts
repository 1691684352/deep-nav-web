export default defineEventHandler((event) => {
  return ok(removeFavoriteRecord(requireAccount(event)), '已清空收藏夹')
})

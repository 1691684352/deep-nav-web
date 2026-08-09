export default defineEventHandler((event) => {
  return ok(saveDraftRecord(requireAccount(event), null), '草稿已删除')
})

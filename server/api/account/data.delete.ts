export default defineEventHandler((event) => {
  return ok(clearAccountData(requireAccount(event)), '账号活动数据已清空')
})

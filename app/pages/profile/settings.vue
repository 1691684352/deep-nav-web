<script setup lang="ts">
import type { ProfileOverviewPayload } from '#shared/types'
import { useAccountStore } from '~/stores/account'

const account = useAccountStore()
const toast = useToast()
const { isDark, toggle } = useTheme()
const { data } = await useAsyncData('profile-settings', () => $api<ProfileOverviewPayload>('/api/account/overview'))

useSeoMeta({
  title: '账号设置 - 个人中心 - 深度指引',
  description: '管理深度指引的账号资料、外观偏好与本地数据。',
  robots: 'noindex, nofollow',
})

const profile = reactive({ nickname: '', bio: '', location: '' })

watchEffect(() => {
  const user = account.user
  if (!user) return
  profile.nickname = user.nickname
  profile.bio = user.bio
  profile.location = user.location
})

async function save() {
  if (!account.user) {
    toast.error('请先登录后再修改资料')
    return
  }
  try {
    await account.updateProfile(profile)
    toast.success('资料已更新')
  }
  catch (error) {
    toast.error(apiErrorMessage(error, '资料更新失败'))
  }
}

async function clearLocalData() {
  try {
    await account.clearActivityData()
    toast.success('收藏、历史与草稿已清空')
  }
  catch (error) {
    toast.error(apiErrorMessage(error, '数据清理失败'))
  }
}
</script>

<template>
  <ProfileShell :nav-items="data?.navItems ?? []">
    <section class="panel rounded-xl p-5" aria-labelledby="settings-title">
      <div class="profile-section-header">
        <div>
          <h2 id="settings-title">账号设置</h2>
          <p class="mt-1 text-[12px] text-muted">资料仅保存在当前浏览器，用于演示完整交互</p>
        </div>
      </div>

      <div class="submit-field-grid">
        <div class="submit-field">
          <label for="settingsNickname">昵称</label>
          <input id="settingsNickname" v-model="profile.nickname" class="submit-input" type="text" maxlength="20">
          <p class="submit-field__help">展示在头像与评论区</p>
        </div>
        <div class="submit-field">
          <label for="settingsLocation">所在地</label>
          <input id="settingsLocation" v-model="profile.location" class="submit-input" type="text" maxlength="30">
          <p class="submit-field__help">选填，例如「中国 · 杭州」</p>
        </div>
        <div class="submit-field submit-field--full">
          <label for="settingsBio">个人简介</label>
          <input id="settingsBio" v-model="profile.bio" class="submit-input" type="text" maxlength="60">
          <p class="submit-field__help">最多 60 字</p>
        </div>
        <div class="submit-field submit-field--full">
          <span class="submit-field__label">手机号</span>
          <p class="text-[13px] font-semibold text-ink">{{ account.user?.phone ?? '未登录' }}</p>
          <p class="submit-field__help">演示环境不支持修改绑定手机号</p>
        </div>
      </div>

      <div class="mt-5 flex flex-wrap gap-2">
        <button class="submit-action-button primary" type="button" @click="save">保存资料</button>
      </div>
    </section>

    <section class="panel rounded-xl p-5" aria-labelledby="preference-title">
      <div class="profile-section-header"><h2 id="preference-title">偏好设置</h2></div>
      <div class="mt-4 space-y-3">
        <div class="flex items-center justify-between gap-4 rounded-lg border border-line p-4">
          <div>
            <p class="text-[13px] font-bold text-ink">深色模式</p>
            <p class="mt-1 text-[12px] text-muted">当前为{{ isDark ? '深色' : '浅色' }}主题，设置会保存在本机</p>
          </div>
          <button class="submit-action-button ghost" type="button" @click="toggle">
            <AppIcon :name="isDark ? 'sun' : 'moon'" class="size-3.5" />切换主题
          </button>
        </div>
        <div class="flex items-center justify-between gap-4 rounded-lg border border-line p-4">
          <div>
            <p class="text-[13px] font-bold text-ink">清除本机数据</p>
            <p class="mt-1 text-[12px] text-muted">清空收藏、浏览历史与投稿草稿，操作不可撤销</p>
          </div>
          <button class="submit-action-button secondary" type="button" @click="clearLocalData">
            <AppIcon name="trash-2" class="size-3.5" />立即清除
          </button>
        </div>
      </div>
    </section>
  </ProfileShell>
</template>

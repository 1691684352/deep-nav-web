<script setup lang="ts">
import type { ProfileOverviewPayload } from '#shared/types'
import { relativeTime } from '#shared/utils'
import { useAccountStore } from '~/stores/account'

const account = useAccountStore()
const toast = useToast()
const { data } = await useAsyncData('profile-history', () => $api<ProfileOverviewPayload>('/api/account/overview'))

useSeoMeta({
  title: '最近使用 - 个人中心 - 深度指引',
  description: '查看你在深度指引最近访问过的工具与网站。',
  robots: 'noindex, nofollow',
})

const keyword = ref('')
const page = ref(1)
const pageSize = 12

const source = computed(() => account.history)
const filtered = computed(() => {
  const needle = keyword.value.trim().toLowerCase()
  if (!needle) return source.value
  return source.value.filter(item => `${item.name} ${item.desc} ${item.category}`.toLowerCase().includes(needle))
})
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))
const paged = computed(() => filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize))

watch([keyword, () => source.value.length], () => (page.value = 1))

async function remove(slug: string) {
  try {
    await account.removeHistory(slug)
    toast.success('已从历史记录中移除')
  }
  catch (error) {
    toast.error(apiErrorMessage(error))
  }
}

async function clearAll() {
  if (!account.history.length) return
  try {
    await account.clearHistory()
    toast.success('已清空浏览历史')
  }
  catch (error) {
    toast.error(apiErrorMessage(error))
  }
}
</script>

<template>
  <ProfileShell :nav-items="data?.navItems ?? []">
    <section class="panel rounded-xl p-5" aria-labelledby="history-title">
      <div class="profile-section-header">
        <div>
          <h2 id="history-title">最近使用</h2>
          <p class="mt-1 text-[12px] text-muted-foreground">共 {{ source.length }} 条浏览记录，仅保存在本机</p>
        </div>
        <button type="button" @click="clearAll">清空历史 <AppIcon name="trash-2" class="size-3.5" /></button>
      </div>

      <div class="result-search-form mt-4">
        <AppIcon name="search" class="size-4 shrink-0 text-muted-foreground" />
        <label class="sr-only" for="historySearch">搜索历史</label>
        <input id="historySearch" v-model="keyword" class="result-search-input" type="search" placeholder="搜索浏览过的工具...">
      </div>

      <div v-if="paged.length" class="mt-3 space-y-1">
        <ProfileActivityRow
          v-for="item in paged"
          :key="item.toolSlug"
          :item="item"
          :time="relativeTime(item.visitedAt)"
          removable
          @remove="remove"
        />
      </div>
      <EmptyState
        v-else
        icon="history"
        title="还没有浏览记录"
        description="打开任意工具后会自动记录足迹"
        action-label="去发现工具"
        @action="navigateTo('/')"
      />

      <PaginationBar :page="page" :total-pages="totalPages" label="历史分页" @change="page = $event" />
    </section>
  </ProfileShell>
</template>

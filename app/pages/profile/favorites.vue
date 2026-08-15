<script setup lang="ts">
import type { ProfileOverviewPayload } from '#shared/types'
import { useAccountStore } from '~/stores/account'

const account = useAccountStore()
const toast = useToast()
const { data } = await useAsyncData('profile-favorites', () => $api<ProfileOverviewPayload>('/api/account/overview'))

useSeoMeta({
  title: '我的收藏 - 个人中心 - 深度指引',
  description: '查看并管理你在深度指引收藏的全部工具与网站。',
  robots: 'noindex, nofollow',
})

const keyword = ref('')
const page = ref(1)
const pageSize = 12

const source = computed(() => account.favorites)
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
    await account.removeFavorite(slug)
    toast.success('已取消收藏')
  }
  catch (error) {
    toast.error(apiErrorMessage(error))
  }
}

async function clearAll() {
  if (!account.favorites.length) return
  try {
    await account.clearFavorites()
    toast.success('已清空收藏夹')
  }
  catch (error) {
    toast.error(apiErrorMessage(error))
  }
}
</script>

<template>
  <ProfileShell :nav-items="data?.navItems ?? []">
    <section class="panel rounded-xl p-5" aria-labelledby="favorites-title">
      <div class="profile-section-header">
        <div>
          <h2 id="favorites-title">我的收藏</h2>
          <p class="mt-1 text-[12px] text-muted">共收藏 {{ source.length }} 个工具</p>
        </div>
        <button type="button" @click="clearAll">清空收藏 <AppIcon name="trash-2" class="size-3.5" /></button>
      </div>

      <div class="result-search-form mt-4">
        <AppIcon name="search" class="size-4 shrink-0 text-muted-foreground" />
        <label class="sr-only" for="favoriteSearch">搜索收藏</label>
        <input id="favoriteSearch" v-model="keyword" class="result-search-input" type="search" placeholder="搜索已收藏的工具...">
      </div>

      <div v-if="paged.length" class="mt-3 space-y-1">
        <ProfileActivityRow
          v-for="item in paged"
          :key="item.toolSlug"
          :item="item"
          :time="item.createdAt"
          removable
          @remove="remove"
        />
      </div>
      <EmptyState
        v-else
        icon="star"
        title="没有匹配的收藏"
        description="换个关键词，或去首页发现更多好工具"
        action-label="去发现工具"
        @action="navigateTo('/')"
      />

      <PaginationBar :page="page" :total-pages="totalPages" label="收藏分页" @change="page = $event" />
    </section>
  </ProfileShell>
</template>

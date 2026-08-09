<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const isNotFound = computed(() => props.error.statusCode === 404)
const title = computed(() => (isNotFound.value ? '页面不存在' : '页面出错了'))
const description = computed(() => (isNotFound.value
  ? '你访问的页面可能已被移动、删除，或者链接输入有误。'
  : props.error.statusMessage || '服务器开小差了，请稍后再试。'))

useSeoMeta({
  title: `${title.value} - 深度指引`,
  description: description.value,
  robots: 'noindex, nofollow',
})

const quickLinks = [
  { to: '/', label: '返回首页', icon: 'house' },
  { to: '/category/all', label: 'AI 导航', icon: 'sparkles' },
  { to: '/ranking', label: '排行榜', icon: 'flame' },
  { to: '/topic', label: '精选专题', icon: 'layers-3' },
]

const keyword = ref('')

function search() {
  const value = keyword.value.trim()
  clearError({ redirect: value ? `/search?keyword=${encodeURIComponent(value)}` : '/search' })
}
</script>

<template>
  <NuxtLayout>
    <section class="mx-auto max-w-[720px] py-10 text-center" aria-labelledby="error-title">
      <p class="number-font text-[88px] font-extrabold leading-none text-brand/25">{{ props.error.statusCode }}</p>
      <h1 id="error-title" class="mt-2 font-display text-[26px] font-extrabold text-ink">{{ title }}</h1>
      <p class="mx-auto mt-3 max-w-[460px] text-[13px] leading-6 text-copy">{{ description }}</p>

      <form class="topic-search mx-auto mt-6 flex max-w-[460px] items-center p-1" role="search" @submit.prevent="search">
        <AppIcon name="search" class="ml-3 size-4 shrink-0 text-muted" />
        <label class="sr-only" for="errorSearch">搜索工具或网站</label>
        <input
          id="errorSearch"
          v-model="keyword"
          class="flex-1 border-0 bg-transparent px-3 text-[13px] text-ink placeholder:text-[#99a3b6]"
          type="search"
          placeholder="换个关键词试试..."
        >
        <button
          class="flex h-9 items-center gap-1.5 rounded-lg bg-brand px-4 text-[12px] font-semibold text-white transition hover:bg-brand-deep"
          type="submit"
        >搜索</button>
      </form>

      <div class="mt-6 flex flex-wrap justify-center gap-2">
        <NuxtLink
          v-for="link in quickLinks"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-1.5 rounded-lg bg-canvas px-3.5 py-2 text-[12px] font-semibold text-copy transition hover:bg-brand-soft hover:text-brand"
          @click="clearError()"
        >
          <AppIcon :name="link.icon" class="size-3.5" />{{ link.label }}
        </NuxtLink>
      </div>
    </section>
  </NuxtLayout>
</template>

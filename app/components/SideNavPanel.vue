<script setup lang="ts">
import { useSiteStore } from '~/stores/site'
import { useUiStore } from '~/stores/ui'

const props = defineProps<{
  activeCategory?: string
  activeAction?: string
}>()

const site = useSiteStore()
const ui = useUiStore()
const toast = useToast()
const route = useRoute()

/** Falls back to the current route so every page highlights the right entry. */
const currentCategory = computed(() => {
  if (props.activeCategory !== undefined) return props.activeCategory
  const match = /^\/category\/(?!subcategory)([^/]+)/.exec(route.path)
  return match?.[1] ?? ''
})

const categoryLinks = computed(() => site.categories.filter(category => category.slug !== 'all'))
const isHome = computed(() => route.path === '/')

const currentAction = computed(() => {
  if (props.activeAction !== undefined) return props.activeAction
  if (route.path.startsWith('/ranking')) return 'ranking'
  if (route.path.startsWith('/profile/favorites')) return 'favorites'
  if (route.path.startsWith('/profile/history')) return 'history'
  if (route.path.startsWith('/submit')) return 'submit'
  return ''
})

const secondaryLinks = [
  { key: 'favorites', label: '我的收藏', icon: 'star', to: '/profile/favorites' },
  { key: 'history', label: '最近使用', icon: 'clock-3', to: '/profile/history' },
  { key: 'submit', label: '提交网站', icon: 'square-pen', to: '/submit' },
]

function openFeedback() {
  ui.toggleDrawer(false)
  toast.info('反馈通道已开启，欢迎在投稿页留言')
  navigateTo('/submit#feedback')
}
</script>

<template>
  <div class="panel rounded-xl p-2.5">
    <nav class="space-y-1">
      <NuxtLink
        to="/"
        class="side-nav-btn flex w-full items-center gap-3 rounded-lg px-3.5 text-[13px]"
        :class="{ active: isHome }"
        @click="ui.toggleDrawer(false)"
      >
        <AppIcon name="house" class="size-[16px]" />
        发现首页
      </NuxtLink>
      <NuxtLink
        v-for="category in categoryLinks"
        :key="category.slug"
        :to="`/category/${category.slug}`"
        class="side-nav-btn flex w-full items-center gap-3 rounded-lg px-3.5 text-[13px]"
        :class="{ active: currentCategory === category.slug }"
        @click="ui.toggleDrawer(false)"
      >
        <AppIcon :name="category.icon" class="size-[16px]" />
        {{ category.label }}
      </NuxtLink>
      <NuxtLink
        to="/ranking"
        class="side-nav-btn flex w-full items-center gap-3 rounded-lg px-3.5 text-[13px]"
        :class="{ active: currentAction === 'ranking' }"
        @click="ui.toggleDrawer(false)"
      >
        <AppIcon name="flame" class="size-[16px]" />热门榜单
      </NuxtLink>
    </nav>
    <div class="my-2 border-t border-line" />
    <nav class="space-y-1 text-[#66718b]">
      <NuxtLink
        v-for="link in secondaryLinks"
        :key="link.key"
        :to="link.to"
        class="side-nav-btn flex w-full items-center gap-3 rounded-lg px-3.5 text-[12px] font-medium"
        :class="{ active: currentAction === link.key }"
        @click="ui.toggleDrawer(false)"
      >
        <AppIcon :name="link.icon" class="size-4" />{{ link.label }}
      </NuxtLink>
      <button
        class="side-nav-btn flex w-full items-center gap-3 rounded-lg px-3.5 text-[12px] font-medium"
        type="button"
        @click="openFeedback"
      >
        <AppIcon name="message-square-more" class="size-4" />建议反馈
      </button>
    </nav>
  </div>
</template>

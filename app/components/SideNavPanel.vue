<script setup lang="ts">
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
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

const itemBase = 'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-[13px] font-medium transition-colors'

function navClass(active: boolean) {
  return cn(itemBase, active ? 'bg-secondary text-secondary-foreground font-semibold' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground')
}

function openFeedback() {
  ui.toggleDrawer(false)
  toast.info('反馈通道已开启，欢迎在投稿页留言')
  navigateTo('/submit#feedback')
}
</script>

<template>
  <nav class="rounded-xl border bg-card p-2 shadow-sm">
    <div class="flex flex-col gap-0.5">
      <NuxtLink to="/" :class="navClass(isHome)" @click="ui.toggleDrawer(false)">
        <AppIcon name="house" class="size-4" />发现首页
      </NuxtLink>
      <NuxtLink
        v-for="category in categoryLinks"
        :key="category.slug"
        :to="`/category/${category.slug}`"
        :class="navClass(currentCategory === category.slug)"
        @click="ui.toggleDrawer(false)"
      >
        <AppIcon :name="category.icon" class="size-4" />{{ category.label }}
      </NuxtLink>
      <NuxtLink to="/ranking" :class="navClass(currentAction === 'ranking')" @click="ui.toggleDrawer(false)">
        <AppIcon name="flame" class="size-4" />热门榜单
      </NuxtLink>
    </div>

    <Separator class="my-2" />

    <div class="flex flex-col gap-0.5">
      <NuxtLink
        v-for="link in secondaryLinks"
        :key="link.key"
        :to="link.to"
        :class="navClass(currentAction === link.key)"
        @click="ui.toggleDrawer(false)"
      >
        <AppIcon :name="link.icon" class="size-4" />{{ link.label }}
      </NuxtLink>
      <button type="button" :class="navClass(false)" @click="openFeedback">
        <AppIcon name="message-square-more" class="size-4" />建议反馈
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAccountStore } from '~/stores/account'
import { useSiteStore } from '~/stores/site'
import { useUiStore } from '~/stores/ui'

const props = defineProps<{
  activeCategory?: string
  activeAction?: string
}>()

const site = useSiteStore()
const ui = useUiStore()
const account = useAccountStore()
const route = useRoute()

/**
 * Entries under `/profile` require a session. When logged out we stop the
 * navigation and surface the login dialog instead of silently redirecting.
 */
function handleNavClick(event: MouseEvent, to: string) {
  if (to.startsWith('/profile') && !account.isLoggedIn) {
    event.preventDefault()
    ui.openLogin()
    ui.toast('请先登录', 'info')
    return
  }
  ui.toggleDrawer(false)
}

/** Falls back to the current route so every page highlights the right entry. */
const currentCategory = computed(() => {
  if (props.activeCategory !== undefined) return props.activeCategory
  const match = /^\/category\/(?!subcategory)([^/]+)/.exec(route.path)
  return match?.[1] ?? ''
})

const categoryLinks = computed(() => site.categories.filter(category => category.slug !== 'all'))
const isHome = computed(() => route.path === '/')
const sideNav = computed(() => site.site?.sideNav)

const currentAction = computed(() => {
  if (props.activeAction !== undefined) return props.activeAction
  if (route.path.startsWith('/ranking')) return 'ranking'
  if (route.path.startsWith('/profile/favorites')) return 'favorites'
  if (route.path.startsWith('/profile/history')) return 'history'
  if (route.path.startsWith('/submit')) return 'submit'
  return ''
})

const secondaryLinks = computed(() => sideNav.value?.secondary ?? [])
</script>

<template>
  <div class="panel rounded-xl p-2.5">
    <nav class="space-y-1">
      <NuxtLink
        :to="sideNav?.home.to ?? '/'"
        class="side-nav-btn flex w-full items-center gap-2.5 rounded-lg px-3 text-[13px]"
        :class="{ active: isHome }"
        @click="ui.toggleDrawer(false)"
      >
        <AppIcon :name="sideNav?.home.icon ?? 'house'" class="size-4" />
        {{ sideNav?.home.label ?? '发现首页' }}
      </NuxtLink>
      <NuxtLink
        v-for="category in categoryLinks"
        :key="category.slug"
        :to="`/category/${category.slug}`"
        class="side-nav-btn flex w-full items-center gap-2.5 rounded-lg px-3 text-[13px]"
        :class="{ active: currentCategory === category.slug }"
        @click="ui.toggleDrawer(false)"
      >
        <AppIcon :name="category.icon" class="size-4" />
        {{ category.label }}
      </NuxtLink>
      <NuxtLink
        :to="sideNav?.ranking.to ?? '/ranking'"
        class="side-nav-btn flex w-full items-center gap-2.5 rounded-lg px-3 text-[13px]"
        :class="{ active: currentAction === 'ranking' }"
        @click="ui.toggleDrawer(false)"
      >
        <AppIcon :name="sideNav?.ranking.icon ?? 'flame'" class="size-4" />{{ sideNav?.ranking.label ?? '热门榜单' }}
      </NuxtLink>
    </nav>
    <div class="my-2 border-t" />
    <nav class="space-y-1 text-muted-foreground">
      <NuxtLink
        v-for="link in secondaryLinks"
        :key="link.id"
        :to="link.to"
        class="side-nav-btn flex w-full items-center gap-2.5 rounded-lg px-3 text-[13px]"
        :class="{ active: currentAction === link.id.replace('side-', '') }"
        @click="handleNavClick($event, link.to)"
      >
        <AppIcon :name="link.icon ?? 'link'" class="size-4" />{{ link.label }}
      </NuxtLink>
      <NuxtLink
        v-if="sideNav?.feedback"
        :to="sideNav.feedback.to"
        class="side-nav-btn flex w-full items-center gap-2.5 rounded-lg px-3 text-[13px]"
        @click="ui.toggleDrawer(false)"
      >
        <AppIcon :name="sideNav.feedback.icon ?? 'message-square-more'" class="size-4" />{{ sideNav.feedback.label }}
      </NuxtLink>
    </nav>
  </div>
</template>

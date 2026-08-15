<script setup lang="ts">
import type { NavLink } from '#shared/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAccountStore } from '~/stores/account'
import { useSiteStore } from '~/stores/site'
import { useUiStore } from '~/stores/ui'

const site = useSiteStore()
const ui = useUiStore()
const account = useAccountStore()
const route = useRoute()
const { isDark, toggle } = useTheme()

const navLinks = computed(() => site.site?.headerNav ?? [])

function isActive(link: NavLink) {
  if (link.kind === 'external') return false
  return [link.to, ...(link.match ?? [])].some((target) => {
    if (target === '/') return route.path === '/'
    return route.path === target || route.path.startsWith(`${target}/`)
  })
}

function handleAvatar() {
  if (account.isLoggedIn) {
    navigateTo('/profile')
    return
  }
  ui.openLogin()
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
    <div class="page-shell flex h-16 items-center gap-7">
      <NuxtLink to="/" class="flex shrink-0 items-center gap-2.5 rounded-md" aria-label="深度指引首页">
        <AppLogo :size="30" />
        <span class="font-display text-[19px] font-extrabold tracking-tight">深度指引</span>
      </NuxtLink>

      <nav class="hidden h-full items-center gap-1 text-[14px] font-medium lg:flex" aria-label="主导航">
        <template v-for="link in navLinks" :key="link.id">
          <a
            v-if="link.kind === 'external'"
            class="flex items-center gap-1.5 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
            :href="link.to"
            :target="link.target"
            :rel="link.rel"
          >
            {{ link.label }}
            <Badge v-if="link.badge" variant="destructive" class="px-1.5 py-0 text-[9px]">{{ link.badge }}</Badge>
            <AppIcon name="arrow-up-right" class="size-3" />
          </a>
          <NuxtLink
            v-else
            :to="link.to"
            class="flex items-center gap-1.5 rounded-md px-3 py-2 transition-colors hover:text-foreground"
            :class="isActive(link) ? 'text-foreground font-semibold' : 'text-muted-foreground'"
          >
            {{ link.label }}
            <Badge v-if="link.badge" variant="destructive" class="px-1.5 py-0 text-[9px]">{{ link.badge }}</Badge>
          </NuxtLink>
        </template>
      </nav>

      <div class="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          aria-label="打开全站搜索"
          :aria-expanded="ui.searchOpen"
          title="全站搜索"
          @click="ui.openSearch()"
        >
          <AppIcon name="search" class="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          :aria-label="isDark ? '切换为亮色主题' : '切换为暗色主题'"
          :aria-pressed="isDark"
          :title="isDark ? '切换为亮色主题' : '切换为暗色主题'"
          @click="toggle"
        >
          <AppIcon v-if="isDark" name="sun" class="size-4" />
          <AppIcon v-else name="moon" class="size-4" />
        </Button>
        <Button as-child size="sm" class="hidden sm:inline-flex">
          <NuxtLink to="/submit">
            <AppIcon name="send" class="size-3.5" />提交收录
          </NuxtLink>
        </Button>

        <Separator orientation="vertical" class="mx-1 !h-6" />

        <button
          type="button"
          class="rounded-full outline-none ring-ring transition focus-visible:ring-2"
          :aria-label="account.isLoggedIn ? '进入个人中心' : '登录或注册'"
          @click="handleAvatar"
        >
          <Avatar class="size-8">
            <AvatarImage :src="account.user?.avatar || '/assets/avatar-default.png'" :alt="account.user ? `${account.user.nickname}头像` : '用户头像'" />
            <AvatarFallback>{{ account.user?.nickname?.slice(0, 1) || '登' }}</AvatarFallback>
          </Avatar>
        </button>

        <Button
          variant="outline"
          size="icon"
          class="lg:hidden"
          aria-label="打开分类菜单"
          aria-controls="mobileMenu"
          :aria-expanded="ui.drawerOpen"
          @click="ui.toggleDrawer(true)"
        >
          <AppIcon name="menu" class="size-5" />
        </Button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { NavLink } from '#shared/types'
import { useAccountStore } from '~/stores/account'
import { useSiteStore } from '~/stores/site'
import { useUiStore } from '~/stores/ui'
import { Button } from '~/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'
import { Separator } from '~/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '~/components/ui/dropdown-menu'

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

const userInitial = computed(() => account.user?.nickname?.slice(0, 1)?.toUpperCase() ?? 'U')

function onLogout() {
  account.logout?.()
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b bg-background/85 backdrop-blur-xl">
    <div class="page-shell flex h-16 items-center gap-7">
      <NuxtLink to="/" class="flex shrink-0 items-center gap-2.5 rounded-md" aria-label="深度指引首页">
        <span class="logo-mark" aria-hidden="true" />
        <span class="font-display text-[19px] font-bold tracking-tight text-foreground">深度指引</span>
      </NuxtLink>

      <nav class="hidden h-full items-center gap-1 text-sm font-medium lg:flex" aria-label="主导航">
        <template v-for="link in navLinks" :key="link.id">
          <a
            v-if="link.kind === 'external'"
            class="nav-link"
            :href="link.to"
            :target="link.target"
            :rel="link.rel"
          >
            <span class="flex items-center gap-1.5">
              {{ link.label }}
              <span v-if="link.badge" class="inline-flex items-center rounded-full bg-destructive px-1.5 py-0.5 text-[9px] font-bold text-white">{{ link.badge }}</span>
              <AppIcon name="arrow-up-right" class="size-3" />
            </span>
          </a>
          <NuxtLink v-else :to="link.to" class="nav-link" :class="{ active: isActive(link) }">
            <span class="flex items-center gap-1.5">
              {{ link.label }}
              <span v-if="link.badge" class="inline-flex items-center rounded-full bg-destructive px-1.5 py-0.5 text-[9px] font-bold text-white">{{ link.badge }}</span>
            </span>
          </NuxtLink>
        </template>
      </nav>

      <div class="ml-auto flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          aria-label="打开全站搜索"
          :aria-expanded="ui.searchOpen"
          title="全站搜索"
          @click="ui.openSearch()"
        >
          <AppIcon name="search" class="size-[18px]" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          :aria-label="isDark ? '切换为亮色主题' : '切换为暗色主题'"
          :aria-pressed="isDark"
          :title="isDark ? '切换为亮色主题' : '切换为暗色主题'"
          @click="toggle"
        >
          <AppIcon v-if="isDark" name="sun" class="size-[18px]" />
          <AppIcon v-else name="moon" class="size-[18px]" />
        </Button>

        <Button
          id="submitTop"
          as-child
          size="sm"
          class="hidden gap-1.5 sm:inline-flex"
        >
          <NuxtLink to="/submit">
            <AppIcon name="send" class="size-3.5" /><span>提交收录</span>
          </NuxtLink>
        </Button>

        <Separator orientation="vertical" class="mx-1 !h-6" />

        <template v-if="account.isLoggedIn">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <button
                id="avatarButton"
                class="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                type="button"
                aria-label="账户菜单"
              >
                <Avatar size="sm" class="border">
                  <AvatarImage :src="account.user?.avatar || '/assets/avatar-default.png'" :alt="`${account.user?.nickname}头像`" />
                  <AvatarFallback>{{ userInitial }}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-52">
              <DropdownMenuLabel>
                <div class="flex flex-col gap-0.5">
                  <span class="text-sm font-medium">{{ account.user?.nickname }}</span>
                  <span class="text-xs font-normal text-muted-foreground">{{ account.user?.location ?? '已登录' }}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem as-child>
                <NuxtLink to="/profile">
                  <AppIcon name="user-round" class="size-4" /><span>个人中心</span>
                </NuxtLink>
              </DropdownMenuItem>
              <DropdownMenuItem as-child>
                <NuxtLink to="/submit">
                  <AppIcon name="send" class="size-4" /><span>提交收录</span>
                </NuxtLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" @select="onLogout">
                <AppIcon name="log-out" class="size-4" /><span>退出登录</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </template>
        <template v-else>
          <Button variant="outline" size="sm" aria-label="登录或注册" @click="ui.openLogin()">
            登录
          </Button>
        </template>

        <Button
          variant="ghost"
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

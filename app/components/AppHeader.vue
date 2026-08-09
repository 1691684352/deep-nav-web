<script setup lang="ts">
import type { NavLink } from '#shared/types'
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
  <header class="sticky top-0 z-50 border-b border-line/80 bg-white/90 backdrop-blur-xl">
    <div class="page-shell flex h-16 items-center gap-7">
      <NuxtLink to="/" class="flex shrink-0 items-center gap-3 rounded-md" aria-label="深度指引首页">
        <span class="logo-mark" aria-hidden="true" />
        <span class="font-display text-[20px] font-extrabold text-ink">深度指引</span>
      </NuxtLink>

      <nav class="hidden h-full items-center gap-8 text-[14px] font-semibold lg:flex" aria-label="主导航">
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
              <span v-if="link.badge" class="rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-extrabold text-white">{{ link.badge }}</span>
              <AppIcon name="arrow-up-right" class="size-3" />
            </span>
          </a>
          <NuxtLink v-else :to="link.to" class="nav-link" :class="{ active: isActive(link) }">
            <span class="flex items-center gap-1.5">
              {{ link.label }}
              <span v-if="link.badge" class="rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-extrabold text-white">{{ link.badge }}</span>
            </span>
          </NuxtLink>
        </template>
      </nav>

      <div class="ml-auto flex items-center gap-2.5">
        <button
          class="header-search-button"
          type="button"
          aria-label="打开全站搜索"
          :aria-expanded="ui.searchOpen"
          title="全站搜索"
          @click="ui.openSearch()"
        >
          <img src="/assets/icon-search.png" width="18" height="18" alt="">
        </button>
        <button
          class="theme-toggle"
          type="button"
          :aria-label="isDark ? '切换为亮色主题' : '切换为暗色主题'"
          :aria-pressed="isDark"
          :title="isDark ? '切换为亮色主题' : '切换为暗色主题'"
          @click="toggle"
        >
          <AppIcon name="moon" class="theme-toggle__moon size-4" />
          <AppIcon name="sun" class="theme-toggle__sun size-4" />
        </button>
        <NuxtLink
          id="submitTop"
          to="/submit"
          class="hidden h-9 items-center gap-1.5 rounded-lg bg-brand px-4 text-[12px] font-semibold text-white shadow-[0_4px_10px_rgba(36,87,245,.14)] transition hover:bg-brand-deep active:scale-[.98] sm:flex"
        >
          <AppIcon name="send" class="size-3.5" /><span>提交收录</span>
        </NuxtLink>
        <div class="ml-1 flex items-center gap-1.5 border-l border-line pl-3">
          <button
            id="avatarButton"
            class="grid size-8 overflow-hidden rounded-full border border-line bg-[#e7eef8] p-0 transition hover:border-brand/30 hover:shadow-sm"
            type="button"
            :aria-label="account.isLoggedIn ? '进入个人中心' : '登录或注册'"
            @click="handleAvatar"
          >
            <img
              :src="account.user?.avatar || '/assets/avatar-default.png'"
              width="32"
              height="32"
              class="size-full object-cover"
              :alt="account.user ? `${account.user.nickname}头像` : '用户头像'"
            >
          </button>
        </div>
        <button
          class="mobile-menu-button"
          type="button"
          aria-label="打开分类菜单"
          aria-controls="mobileMenu"
          :aria-expanded="ui.drawerOpen"
          @click="ui.toggleDrawer(true)"
        >
          <AppIcon name="menu" class="size-5" />
        </button>
      </div>
    </div>
  </header>
</template>

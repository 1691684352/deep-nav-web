<script setup lang="ts">
import { useAccountStore } from '~/stores/account'
import { useUiStore } from '~/stores/ui'

const props = defineProps<{
  navItems: Array<{ key: string, label: string, icon: string, to: string }>
}>()

const account = useAccountStore()
const ui = useUiStore()
const toast = useToast()
const route = useRoute()

const activeKey = computed(() => {
  const match = props.navItems
    .filter(item => item.to !== '/profile')
    .find(item => route.path.startsWith(item.to))
  return match?.key ?? 'overview'
})

async function logout() {
  try {
    await account.logout()
    toast.success('已退出登录')
    await navigateTo('/')
  }
  catch (error) {
    toast.error(apiErrorMessage(error, '退出登录失败'))
  }
}

function requireLogin() {
  if (account.isLoggedIn) return
  ui.openLogin()
}

onMounted(requireLogin)
</script>

<template>
  <section class="profile-page" aria-label="个人中心">
    <div class="profile-layout">
      <aside class="profile-rail" aria-label="个人中心导航">
        <div class="panel rounded-xl profile-nav-panel">
          <nav class="space-y-1">
            <NuxtLink
              v-for="item in props.navItems"
              :key="item.key"
              :to="item.to"
              class="side-nav-btn flex w-full items-center gap-2.5 rounded-lg px-3 text-[13px]"
              :class="{ active: activeKey === item.key }"
            >
              <AppIcon :name="item.icon" class="size-4" />{{ item.label }}
            </NuxtLink>
          </nav>
          <div class="profile-nav-panel__logout">
            <div class="profile-nav-panel__divider" />
            <button
              class="side-nav-btn flex w-full items-center gap-2.5 rounded-lg px-3 text-[13px]"
              type="button"
              @click="logout"
            >
              <AppIcon name="log-out" class="size-4" />退出登录
            </button>
          </div>
        </div>
      </aside>

      <div class="min-w-0 space-y-4">
        <slot />
      </div>
    </div>
  </section>
</template>

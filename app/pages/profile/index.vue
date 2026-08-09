<script setup lang="ts">
import type { ProfileOverviewPayload } from '#shared/types'
import { relativeTime } from '#shared/utils'
import { useAccountStore } from '~/stores/account'

const account = useAccountStore()
const { data } = await useAsyncData('profile-overview', () => $api<ProfileOverviewPayload>('/api/account/overview'))
useSeoFromApi(() => data.value?.seo)

const user = computed(() => account.user)
const favorites = computed(() => account.favorites)
const history = computed(() => account.history)
const submissions = computed(() => account.submissions)

const joinedDays = computed(() => {
  const joined = user.value?.joinedAt
  if (!joined) return 0
  return Math.max(1, Math.round((Date.now() - new Date(joined).getTime()) / 86400000))
})

const stats = computed(() => [
  { key: 'favorites', label: '收藏工具', value: account.favorites.length, icon: 'star', to: '/profile/favorites', fill: true },
  { key: 'history', label: '最近使用', value: account.history.length, icon: 'clock-3', to: '/profile/history', fill: false },
  { key: 'submissions', label: '投稿收录', value: account.submissions.length, icon: 'cloud-upload', to: '/profile/submissions', fill: false },
  { key: 'feedback', label: '我的点评', value: account.myReviews.length, icon: 'message-square', to: '/profile/feedback', fill: false },
])
</script>

<template>
  <ProfileShell :nav-items="data?.navItems ?? []">
    <section id="profile-overview" class="panel rounded-xl profile-hero">
      <div class="profile-hero__avatar">
        <img :src="user?.avatar ?? '/assets/avatar-default.png'" width="88" height="88" :alt="`${user?.nickname ?? '访客'}头像`">
      </div>
      <div class="profile-hero__copy">
        <div class="profile-hero__name">
          {{ user?.nickname ?? '未登录访客' }}
          <span v-if="user?.levelLabel" class="profile-level">
            <AppIcon name="shield-check" class="size-3" />{{ user.levelLabel }}
          </span>
        </div>
        <p class="profile-hero__welcome">{{ user?.bio ?? '登录后即可同步收藏、历史与投稿记录。' }}</p>
        <div class="profile-hero__meta">
          <span><AppIcon name="circle-user-round" class="size-3.5" />加入深度指引 {{ joinedDays }} 天</span>
          <span><AppIcon name="clock-3" class="size-3.5" />累计使用工具 {{ history.length }} 个</span>
        </div>
      </div>
    </section>

    <section class="profile-stat-grid" aria-label="个人数据概览">
      <article v-for="stat in stats" :key="stat.key" class="panel rounded-xl profile-stat">
        <span class="profile-stat__icon">
          <AppIcon :name="stat.icon" class="size-6" :fill="stat.fill" />
        </span>
        <div class="profile-stat__copy">
          <span class="profile-stat__label">{{ stat.label }}</span>
          <strong class="profile-stat__value">{{ stat.value }}</strong>
          <NuxtLink class="profile-stat__link" :to="stat.to">查看全部 <AppIcon name="arrow-right" class="size-3" /></NuxtLink>
        </div>
      </article>
    </section>

    <div class="profile-content-grid">
      <section class="panel rounded-xl p-5" aria-labelledby="profile-recent-title">
        <div class="profile-section-header">
          <h2 id="profile-recent-title">最近使用</h2>
          <NuxtLink to="/profile/history">查看全部 <AppIcon name="arrow-right" class="size-3.5" /></NuxtLink>
        </div>
        <div v-if="history.length" class="mt-3 space-y-1">
          <ProfileActivityRow
            v-for="item in history.slice(0, 5)"
            :key="item.toolSlug"
            :item="item"
            :time="relativeTime(item.visitedAt)"
          />
        </div>
        <EmptyState v-else icon="history" title="还没有浏览记录" description="打开任意工具后会自动记录足迹" />
        <div class="profile-section-footer">
          <NuxtLink to="/profile/history">查看全部使用历史 <AppIcon name="arrow-right" class="size-3.5" /></NuxtLink>
        </div>
      </section>

      <section class="panel rounded-xl p-5" aria-labelledby="profile-favorites-title">
        <div class="profile-section-header">
          <h2 id="profile-favorites-title">我的收藏</h2>
          <NuxtLink to="/profile/favorites">查看全部 <AppIcon name="arrow-right" class="size-3.5" /></NuxtLink>
        </div>
        <div v-if="favorites.length" class="mt-3 space-y-1">
          <ProfileActivityRow v-for="item in favorites.slice(0, 5)" :key="item.toolSlug" :item="item" />
        </div>
        <EmptyState v-else icon="star" title="还没有收藏的工具" description="在任意工具卡片上点击收藏即可加入" />
        <div class="profile-section-footer">
          <NuxtLink to="/profile/favorites">查看全部收藏 <AppIcon name="arrow-right" class="size-3.5" /></NuxtLink>
        </div>
      </section>
    </div>

    <section class="panel rounded-xl p-5" aria-labelledby="profile-submissions-title">
      <div class="profile-section-header">
        <h2 id="profile-submissions-title">我的投稿</h2>
        <NuxtLink to="/profile/submissions">查看全部 <AppIcon name="arrow-right" class="size-3.5" /></NuxtLink>
      </div>
      <div v-if="submissions.length" class="profile-submission-table">
        <div class="profile-submission-head">
          <span>工具名称</span><span>分类</span><span>状态</span><span>提交时间</span><span>操作</span>
        </div>
        <div v-for="item in submissions.slice(0, 3)" :key="item.id" class="profile-submission-row">
          <strong>{{ item.name }}</strong>
          <span>{{ item.category }}</span>
          <span class="profile-status" :class="item.status">{{ item.statusLabel }}</span>
          <time>{{ item.submittedAt }}</time>
          <NuxtLink class="profile-row-link" to="/profile/submissions">查看详情</NuxtLink>
        </div>
      </div>
      <EmptyState v-else icon="inbox" title="还没有投稿记录" action-label="去提交网站" @action="navigateTo('/submit')" />
      <div class="profile-section-footer">
        <NuxtLink to="/profile/submissions">查看全部投稿 <AppIcon name="arrow-right" class="size-3.5" /></NuxtLink>
      </div>
    </section>
  </ProfileShell>
</template>

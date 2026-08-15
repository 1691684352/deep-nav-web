<script setup lang="ts">
import type { ProfileOverviewPayload } from '#shared/types'
import { relativeTime } from '#shared/utils'
import { useAccountStore } from '~/stores/account'

const account = useAccountStore()
const { data } = await useAsyncData('profile-feedback', () => $api<ProfileOverviewPayload>('/api/account/overview'))

useSeoMeta({
  title: '我的点评 - 个人中心 - 深度指引',
  description: '查看你在深度指引发表过的工具点评。',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <ProfileShell :nav-items="data?.navItems ?? []">
    <section class="panel rounded-xl p-5" aria-labelledby="feedback-title">
      <div class="profile-section-header">
        <div>
        <h2 id="feedback-title">我的点评</h2>
          <p class="mt-1 text-[12px] text-muted-foreground">共发表 {{ account.myReviews.length }} 条点评</p>
        </div>
        <NuxtLink to="/feedback">提交建议 <AppIcon name="arrow-right" class="size-3.5" /></NuxtLink>
      </div>

      <div v-if="account.myReviews.length" class="mt-4 space-y-3">
        <article v-for="review in account.myReviews" :key="review.id" class="rounded-lg border border-border p-4">
          <div class="flex items-center justify-between gap-3">
            <NuxtLink :to="`/tool/${review.toolSlug}`" class="text-[13px] font-bold text-foreground hover:text-foreground">
              {{ review.toolSlug }}
            </NuxtLink>
            <span class="flex items-center gap-0.5 text-foreground">
              <AppIcon v-for="star in review.rating" :key="star" name="star" class="size-3.5" fill />
            </span>
          </div>
          <p class="mt-2 text-[12px] leading-6 text-muted-foreground">{{ review.content }}</p>
          <p class="mt-2 text-[11px] text-muted-foreground">{{ relativeTime(review.createdAt) }}</p>
        </article>
      </div>
      <EmptyState
        v-else
        icon="message-square-text"
        title="还没有发表过反馈"
        description="在工具详情页给出评分与点评，帮助更多人做选择"
        action-label="去发现工具"
        @action="navigateTo('/')"
      />
    </section>
  </ProfileShell>
</template>

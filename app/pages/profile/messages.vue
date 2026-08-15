<script setup lang="ts">
import type { ProfileOverviewPayload } from '#shared/types'
import { relativeTime } from '#shared/utils'
const { data } = await useAsyncData('profile-messages', () => $api<ProfileOverviewPayload>('/api/account/overview'))

useSeoMeta({
  title: '消息通知 - 个人中心 - 深度指引',
  description: '查看深度指引的审核结果与站内通知。',
  robots: 'noindex, nofollow',
})

const messages = computed(() => data.value?.messages ?? [])
</script>

<template>
  <ProfileShell :nav-items="data?.navItems ?? []">
    <section class="panel rounded-xl p-5" aria-labelledby="messages-title">
      <div class="profile-section-header">
        <div>
          <h2 id="messages-title">消息通知</h2>
          <p class="mt-1 text-[12px] text-muted">共 {{ messages.length }} 条站内通知</p>
        </div>
        <NuxtLink to="/profile/submissions">查看投稿 <AppIcon name="arrow-right" class="size-3.5" /></NuxtLink>
      </div>

      <div v-if="messages.length" class="mt-4 space-y-2">
        <article v-for="message in messages" :key="message.id" class="flex gap-3 rounded-lg border border-border p-4">
          <span class="profile-stat__icon size-10 shrink-0">
            <AppIcon :name="message.icon" class="size-5" />
          </span>
          <div class="min-w-0">
            <p class="text-[13px] font-bold text-foreground">{{ message.title }}</p>
            <p class="mt-1 text-[12px] leading-6 text-muted-foreground">{{ message.body }}</p>
            <p class="mt-1 text-[11px] text-muted">{{ relativeTime(message.time) }}</p>
          </div>
        </article>
      </div>
      <EmptyState v-else icon="bell" title="暂无新消息" description="投稿审核与官方公告会出现在这里" />
    </section>
  </ProfileShell>
</template>

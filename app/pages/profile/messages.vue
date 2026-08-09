<script setup lang="ts">
import type { SeoMeta, Submission } from '#shared/types'
import { relativeTime } from '#shared/utils'
import { useAccountStore } from '~/stores/account'

interface ProfilePayload {
  seo: SeoMeta
  navItems: Array<{ key: string, label: string, icon: string, to: string }>
  submissions: Submission[]
}

const account = useAccountStore()
const { data } = await useAsyncData('profile-messages', () => $api<ProfilePayload>('/api/account/overview'))

useSeoMeta({
  title: '消息通知 - 个人中心 - 深度指引',
  description: '查看深度指引的审核结果与站内通知。',
  robots: 'noindex, nofollow',
})

const statusIcon: Record<Submission['status'], string> = {
  review: 'clock-3',
  approved: 'circle-check',
  rejected: 'circle-x',
}

/** Notifications are derived from submission status changes. */
const messages = computed(() => {
  const submissions = account.submissions.length ? account.submissions : data.value?.submissions ?? []
  return submissions.map(item => ({
    id: item.id,
    icon: statusIcon[item.status],
    status: item.status,
    title: item.status === 'review'
      ? `「${item.name}」已进入审核队列`
      : item.status === 'approved'
        ? `「${item.name}」已通过审核`
        : `「${item.name}」未通过审核`,
    body: item.status === 'approved'
      ? '网站已展示在对应分类中，感谢你的贡献。'
      : item.status === 'rejected'
        ? '内容与现有收录重复或信息不完整，欢迎补充后再次提交。'
        : '我们会在 1-3 个工作日内完成审核，结果将通过邮件通知。',
    time: item.updatedAt,
  }))
})
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
        <article v-for="message in messages" :key="message.id" class="flex gap-3 rounded-lg border border-line p-4">
          <span class="profile-stat__icon size-10 shrink-0">
            <AppIcon :name="message.icon" class="size-5" />
          </span>
          <div class="min-w-0">
            <p class="text-[13px] font-bold text-ink">{{ message.title }}</p>
            <p class="mt-1 text-[12px] leading-6 text-copy">{{ message.body }}</p>
            <p class="mt-1 text-[11px] text-muted">{{ relativeTime(message.time) }}</p>
          </div>
        </article>
      </div>
      <EmptyState v-else icon="bell" title="暂无新消息" description="投稿审核与官方公告会出现在这里" />
    </section>
  </ProfileShell>
</template>

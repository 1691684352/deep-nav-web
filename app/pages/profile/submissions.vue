<script setup lang="ts">
import type { ProfileOverviewPayload, Submission } from '#shared/types'
import { useAccountStore } from '~/stores/account'

const account = useAccountStore()
const toast = useToast()
const { data } = await useAsyncData('profile-submissions', () => $api<ProfileOverviewPayload>('/api/account/overview'))

useSeoMeta({
  title: '我的投稿 - 个人中心 - 深度指引',
  description: '查看你提交给深度指引的网站收录进度与审核状态。',
  robots: 'noindex, nofollow',
})

const statusFilters = computed(() => data.value?.statusFilters ?? [])

const status = ref('all')
const active = ref<Submission | null>(null)

const source = computed(() => account.submissions)
const filtered = computed(() =>
  status.value === 'all' ? source.value : source.value.filter(item => item.status === status.value))

function countOf(value: string) {
  return value === 'all' ? source.value.length : source.value.filter(item => item.status === value).length
}

async function withdraw(item: Submission) {
  try {
    await account.removeSubmission(item.id)
    active.value = null
    toast.success(`已撤回「${item.name}」的投稿`)
  }
  catch (error) {
    toast.error(apiErrorMessage(error))
  }
}
</script>

<template>
  <ProfileShell :nav-items="data?.navItems ?? []">
    <section class="panel rounded-xl p-5" aria-labelledby="submissions-title">
      <div class="profile-section-header">
        <div>
          <h2 id="submissions-title">我的投稿</h2>
          <p class="mt-1 text-[12px] text-muted">共提交 {{ source.length }} 个网站，审核周期 1-3 个工作日</p>
        </div>
        <NuxtLink to="/submit">提交新网站 <AppIcon name="plus" class="size-3.5" /></NuxtLink>
      </div>

      <div class="result-filter-tabs mt-4" role="tablist" aria-label="投稿状态筛选">
        <button
          v-for="item in statusFilters"
          :key="item.value"
          class="result-filter-tab"
          :class="{ active: status === item.value }"
          type="button"
          role="tab"
          :aria-selected="status === item.value"
          @click="status = item.value"
        >{{ item.label }} <span class="count">{{ countOf(item.value) }}</span></button>
      </div>

      <div v-if="filtered.length" class="profile-submission-table">
        <div class="profile-submission-head">
          <span>工具名称</span><span>分类</span><span>状态</span><span>提交时间</span><span>操作</span>
        </div>
        <div v-for="item in filtered" :key="item.id" class="profile-submission-row">
          <strong>{{ item.name }}</strong>
          <span>{{ item.category }}</span>
          <span class="profile-status" :class="item.status">{{ item.statusLabel }}</span>
          <time>{{ item.submittedAt }}</time>
          <button class="profile-row-link" type="button" @click="active = item">查看详情</button>
        </div>
      </div>
      <EmptyState
        v-else
        icon="inbox"
        title="该状态下暂无投稿"
        description="提交优质网站，让更多人发现它的价值"
        action-label="去提交网站"
        @action="navigateTo('/submit')"
      />
    </section>

    <BaseDialog :open="Boolean(active)" dialog-class="global-search-dialog" aria-labelledby="submissionDetailTitle" @close="active = null">
      <div class="global-search-panel">
        <div class="global-search-head">
          <h2 id="submissionDetailTitle" class="font-display">投稿详情</h2>
          <button class="global-search-close" type="button" aria-label="关闭投稿详情" @click="active = null">
            <AppIcon name="x" class="size-5" />
          </button>
        </div>
        <dl v-if="active" class="grid gap-3 p-5 text-[13px] text-muted-foreground sm:grid-cols-2">
          <div><dt class="text-[11px] text-muted">网站名称</dt><dd class="mt-1 font-semibold text-foreground">{{ active.name }}</dd></div>
          <div><dt class="text-[11px] text-muted">网站地址</dt><dd class="mt-1 truncate font-semibold text-foreground">{{ active.url }}</dd></div>
          <div><dt class="text-[11px] text-muted">分类</dt><dd class="mt-1 font-semibold text-foreground">{{ active.category }}</dd></div>
          <div><dt class="text-[11px] text-muted">状态</dt><dd class="mt-1"><span class="profile-status" :class="active.status">{{ active.statusLabel }}</span></dd></div>
          <div><dt class="text-[11px] text-muted">提交时间</dt><dd class="mt-1 font-semibold text-foreground">{{ active.submittedAt }}</dd></div>
          <div><dt class="text-[11px] text-muted">更新时间</dt><dd class="mt-1 font-semibold text-foreground">{{ active.updatedAt }}</dd></div>
          <div class="sm:col-span-2"><dt class="text-[11px] text-muted">一句话描述</dt><dd class="mt-1 text-foreground">{{ active.slogan }}</dd></div>
          <div class="sm:col-span-2"><dt class="text-[11px] text-muted">网站描述</dt><dd class="mt-1 leading-6">{{ active.description }}</dd></div>
          <div class="sm:col-span-2"><dt class="text-[11px] text-muted">标签</dt><dd class="mt-1 flex flex-wrap gap-1.5">
            <span v-for="tag in active.tags" :key="tag" class="submit-tag">{{ tag }}</span>
          </dd></div>
        </dl>
        <div class="flex justify-end gap-2 border-t border-border px-5 py-4">
          <button class="submit-action-button secondary" type="button" @click="active = null">关闭</button>
          <button
            v-if="active && active.status === 'review' && account.submissions.some(item => item.id === active!.id)"
            class="submit-action-button ghost"
            type="button"
            @click="withdraw(active)"
          >撤回投稿</button>
        </div>
      </div>
    </BaseDialog>
  </ProfileShell>
</template>

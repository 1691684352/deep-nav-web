<script setup lang="ts">
import type { FeedbackForm, FeedbackOptionsPayload, FeedbackRecord } from '#shared/types'
import { useAccountStore } from '~/stores/account'
import { useUiStore } from '~/stores/ui'

const account = useAccountStore()
const ui = useUiStore()
const toast = useToast()
const { data } = await useAsyncData('feedback-options', () => $api<FeedbackOptionsPayload>('/api/feedback/options'))

useSeoFromApi(() => data.value?.seo)

const form = reactive<FeedbackForm>({
  type: 'suggestion',
  content: '',
  contact: '',
})
const submitting = ref(false)
const error = ref('')

async function submit() {
  if (!account.isLoggedIn) {
    ui.openLogin()
    toast.info('登录后即可提交反馈')
    return
  }
  error.value = ''
  submitting.value = true
  try {
    await $api<FeedbackRecord>('/api/feedback', { method: 'POST', body: form })
    form.type = 'suggestion'
    form.content = ''
    form.contact = ''
    toast.success('反馈提交成功，感谢你的建议')
  }
  catch (reason) {
    error.value = apiErrorMessage(reason)
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)_260px]">
    <LeftRail active-action="feedback" />

    <section class="panel rounded-xl p-6" aria-labelledby="feedback-page-title">
      <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Feedback</p>
      <h1 id="feedback-page-title" class="mt-2 font-display text-[24px] font-extrabold text-foreground">建议反馈</h1>
      <p class="mt-2 text-[13px] leading-6 text-muted-foreground">你的建议会直接进入产品反馈队列，帮助我们持续改善导航内容和使用体验。</p>

      <form class="mt-6 space-y-5" @submit.prevent="submit">
        <div>
          <label for="feedbackType" class="text-[12px] font-semibold text-foreground">反馈类型</label>
          <select id="feedbackType" v-model="form.type" class="submit-select mt-2 w-full">
            <option v-for="item in data?.types ?? []" :key="item.value" :value="item.value">{{ item.label }}</option>
          </select>
        </div>

        <div>
          <label for="feedbackContent" class="text-[12px] font-semibold text-foreground">反馈内容</label>
          <textarea
            id="feedbackContent"
            v-model.trim="form.content"
            class="submit-textarea mt-2 min-h-48 w-full"
            maxlength="1000"
            :placeholder="data?.contentPlaceholder"
          />
          <p class="mt-1 text-right text-[11px] text-muted-foreground">{{ form.content.length }} / 1000</p>
        </div>

        <div>
          <label for="feedbackContact" class="text-[12px] font-semibold text-foreground">联系方式</label>
          <input
            id="feedbackContact"
            v-model.trim="form.contact"
            class="submit-input mt-2 w-full"
            maxlength="100"
            :placeholder="data?.contactPlaceholder"
          >
        </div>

        <p v-if="error" class="text-[12px] font-medium text-destructive">{{ error }}</p>
        <button class="submit-action-button primary" type="submit" :disabled="submitting">
          {{ submitting ? '提交中…' : '提交反馈' }}
        </button>
      </form>
    </section>

    <aside class="panel h-fit rounded-xl p-5">
      <h2 class="font-display text-[15px] font-bold text-foreground">反馈说明</h2>
      <ul class="mt-4 space-y-3 text-[12px] leading-6 text-muted-foreground">
        <li v-for="notice in data?.notices ?? []" :key="notice" class="flex gap-2">
          <AppIcon name="circle-check" class="mt-1 size-3.5 shrink-0 text-primary" />
          <span>{{ notice }}</span>
        </li>
      </ul>
    </aside>
  </div>
</template>

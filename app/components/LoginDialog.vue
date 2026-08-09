<script setup lang="ts">
import type { AuthSession, FavoriteItem, HistoryItem, Submission } from '#shared/types'
import { useAccountStore } from '~/stores/account'
import { useUiStore } from '~/stores/ui'

interface LoginResponse {
  session: AuthSession
  favorites: FavoriteItem[]
  history: HistoryItem[]
  submissions: Submission[]
}

const ui = useUiStore()
const account = useAccountStore()
const toast = useToast()

const phone = ref('')
const code = ref('')
const error = ref('')
const sending = ref(false)
const submitting = ref(false)
const countdown = ref(0)
const phoneInput = ref<HTMLInputElement | null>(null)

let timer: ReturnType<typeof setInterval> | undefined

watch(() => ui.loginOpen, async (open) => {
  if (!open) {
    error.value = ''
    return
  }
  await nextTick()
  phoneInput.value?.focus({ preventScroll: true })
})

onBeforeUnmount(() => clearInterval(timer))

function startCountdown() {
  countdown.value = 60
  clearInterval(timer)
  timer = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) clearInterval(timer)
  }, 1000)
}

async function sendCode() {
  if (countdown.value > 0 || sending.value) return
  error.value = ''
  sending.value = true
  try {
    const payload = await $api<{ hint: string }>('/api/auth/code', {
      method: 'POST',
      body: { phone: phone.value },
    })
    startCountdown()
    toast.success(payload.hint)
  }
  catch (err) {
    error.value = apiErrorMessage(err)
  }
  finally {
    sending.value = false
  }
}

async function submit() {
  if (submitting.value) return
  error.value = ''
  submitting.value = true
  try {
    const payload = await $api<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: { phone: phone.value, code: code.value },
    })
    account.applyLogin(payload)
    ui.closeLogin()
    phone.value = ''
    code.value = ''
    toast.success(`欢迎回来，${payload.session.user.nickname}`)
  }
  catch (err) {
    error.value = apiErrorMessage(err)
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <BaseDialog
    :open="ui.loginOpen"
    dialog-class="m-auto w-[min(420px,calc(100%-32px))] rounded-2xl border-0 bg-white p-0 shadow-2xl"
    @close="ui.closeLogin()"
  >
    <form class="p-6" @submit.prevent="submit">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="font-display text-[20px] font-bold">欢迎回来</h2>
          <p class="mt-1 text-[12px] text-muted">登录后同步收藏与浏览记录</p>
        </div>
        <button
          class="grid size-10 place-items-center rounded-full text-muted transition hover:bg-canvas hover:text-ink"
          type="button"
          aria-label="关闭登录弹窗"
          @click="ui.closeLogin()"
        >
          <AppIcon name="x" class="size-5" />
        </button>
      </div>

      <label for="loginPhone" class="mt-6 block text-[12px] font-semibold">手机号</label>
      <input
        id="loginPhone"
        ref="phoneInput"
        v-model.trim="phone"
        class="mt-2 h-11 w-full rounded-lg border border-line px-3 text-[13px] outline-none transition focus:border-brand"
        type="tel"
        autocomplete="tel"
        placeholder="请输入手机号"
        maxlength="11"
      >

      <label for="loginCode" class="mt-4 block text-[12px] font-semibold">验证码</label>
      <div class="mt-2 flex gap-2">
        <input
          id="loginCode"
          v-model.trim="code"
          class="h-11 min-w-0 flex-1 rounded-lg border border-line px-3 text-[13px] outline-none transition focus:border-brand"
          inputmode="numeric"
          maxlength="6"
          placeholder="6 位验证码"
        >
        <button
          class="h-11 shrink-0 rounded-lg bg-brand-soft px-4 text-[12px] font-semibold text-brand disabled:opacity-60"
          type="button"
          :disabled="countdown > 0 || sending"
          @click="sendCode"
        >
          {{ countdown > 0 ? `${countdown}s 后重发` : '获取验证码' }}
        </button>
      </div>

      <p v-if="error" class="mt-3 text-[12px] font-medium text-[#e25760]">{{ error }}</p>

      <button
        class="mt-6 h-11 w-full rounded-lg bg-brand text-[13px] font-semibold text-white transition hover:bg-brand-deep disabled:opacity-70"
        type="submit"
        :disabled="submitting"
      >
        {{ submitting ? '登录中…' : '登录 / 注册' }}
      </button>
      <p class="mt-4 text-center text-[11px] leading-5 text-muted">继续即表示你同意《用户协议》和《隐私政策》</p>
    </form>
  </BaseDialog>
</template>

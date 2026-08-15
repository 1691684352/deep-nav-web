<script setup lang="ts">
import type { AuthSession, FavoriteItem, HistoryItem, Submission } from '#shared/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
const phoneInput = ref<InstanceType<typeof Input> | null>(null)

let timer: ReturnType<typeof setInterval> | undefined

watch(() => ui.loginOpen, async (open) => {
  if (!open) {
    error.value = ''
    return
  }
  await nextTick()
  ;(phoneInput.value?.$el as HTMLInputElement | undefined)?.focus({ preventScroll: true })
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
  <Dialog :open="ui.loginOpen" @update:open="(value) => !value && ui.closeLogin()">
    <DialogContent class="sm:max-w-[420px]">
      <DialogHeader>
        <DialogTitle class="font-display text-[20px]">欢迎回来</DialogTitle>
        <DialogDescription>登录后同步收藏与浏览记录</DialogDescription>
      </DialogHeader>

      <form class="flex flex-col gap-4" @submit.prevent="submit">
        <div class="flex flex-col gap-2">
          <Label for="loginPhone">手机号</Label>
          <Input
            id="loginPhone"
            ref="phoneInput"
            v-model.trim="phone"
            type="tel"
            autocomplete="tel"
            placeholder="请输入手机号"
            maxlength="11"
          />
        </div>

        <div class="flex flex-col gap-2">
          <Label for="loginCode">验证码</Label>
          <div class="flex gap-2">
            <Input
              id="loginCode"
              v-model.trim="code"
              inputmode="numeric"
              maxlength="6"
              placeholder="6 位验证码"
              class="min-w-0 flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              class="shrink-0"
              :disabled="countdown > 0 || sending"
              @click="sendCode"
            >
              {{ countdown > 0 ? `${countdown}s 后重发` : '获取验证码' }}
            </Button>
          </div>
        </div>

        <p v-if="error" class="text-[12px] font-medium text-destructive">{{ error }}</p>

        <Button type="submit" class="w-full" :disabled="submitting">
          {{ submitting ? '登录中…' : '登录 / 注册' }}
        </Button>
        <p class="text-center text-[11px] leading-5 text-muted-foreground">继续即表示你同意《用户协议》和《隐私政策》</p>
      </form>
    </DialogContent>
  </Dialog>
</template>

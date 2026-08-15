<script setup lang="ts">
import type { Category, NavCategory, SeoMeta, Submission, SubmissionForm } from '#shared/types'
import { formatDateTime, initialOf } from '#shared/utils'
import { submissionStepFields, validateSubmission, validateSubmissionStep } from '#shared/utils/validation'
import type { SubmissionErrors } from '#shared/utils/validation'
import { useAccountStore } from '~/stores/account'
import { useUiStore } from '~/stores/ui'

interface SubmitOptions {
  seo: SeoMeta
  categories: Category[]
  navCategories: NavCategory[]
  languages: string[]
  suggestedTags: string[]
  steps: Array<{ step: number, title: string, hint: string }>
  notices: string[]
  markdownHints: string[]
}

const account = useAccountStore()
const ui = useUiStore()
const toast = useToast()

const { data: options } = await useAsyncData('submit-options', () => $api<SubmitOptions>('/api/submissions/options'))
useSeoFromApi(() => options.value?.seo)

const form = reactive<SubmissionForm>({
  name: '',
  url: '',
  icon: '',
  categorySlug: '',
  navCategorySlug: '',
  language: '中文',
  slogan: '',
  description: '',
  tags: [],
  contactName: '',
  contactEmail: '',
  contactWechat: '',
  remark: '',
  agreement: false,
})

const step = ref(1)
const errors = ref<SubmissionErrors>({})
const submitting = ref(false)
const tagInput = ref('')
const previewing = ref(false)
const iconInput = ref<HTMLInputElement | null>(null)

const currentStep = computed(() => options.value?.steps.find(item => item.step === step.value))
const nextLabel = computed(() =>
  step.value === 1 ? '下一步：网站详情' : step.value === 2 ? '下一步：提交审核' : '提交审核')

const subCategories = computed(() => options.value?.navCategories.filter(item => item.slug !== 'hot') ?? [])

/** Preview mirrors the form so authors see exactly what reviewers will see. */
const previewName = computed(() => form.name.trim() || '未命名网站')
const previewSlogan = computed(() => form.slogan.trim() || '用一句话说明网站的价值')
const previewTags = computed(() => form.tags.slice(0, 3))
const previewDescription = computed(() =>
  form.description.replace(/^#{1,6}\s*/gm, '').replace(/[*_`>#]/g, '').replace(/\n+/g, ' ').trim()
  || '完善网站描述后，这里会展示摘要内容。')
const previewHost = computed(() => {
  const raw = form.url.trim()
  if (!raw) return 'example.com'
  try {
    return new URL(raw).hostname
  }
  catch {
    return raw.replace(/^https?:\/\//, '').split('/')[0] || 'example.com'
  }
})
const markdownPreview = computed(() => renderMarkdown(form.description))

onMounted(() => {
  const draft = account.draft
  if (!draft) return
  Object.assign(form, { ...draft, savedAt: undefined, step: undefined })
  step.value = draft.step ?? 1
  toast.info(`已恢复 ${draft.savedAt} 保存的草稿`)
})

function fieldError(field: keyof SubmissionForm) {
  return errors.value[field]
}

function addTag(value: string) {
  const tag = value.trim().replace(/[,，]/g, '')
  if (!tag) return
  if (form.tags.includes(tag)) {
    toast.error('标签已存在')
    return
  }
  if (form.tags.length >= 10) {
    toast.error('最多添加 10 个标签')
    return
  }
  form.tags = [...form.tags, tag]
  tagInput.value = ''
}

function removeTag(tag: string) {
  form.tags = form.tags.filter(item => item !== tag)
}

function insertMarkdown(token: string) {
  const wrap = token === '**' || token === '_'
  form.description += wrap ? `${token}文本${token}` : token.includes('链接') ? token : `\n${token}`
}

function pickIcon() {
  iconInput.value?.click()
}

function onIconChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    toast.error('图标文件不能超过 2MB')
    ;(event.target as HTMLInputElement).value = ''
    return
  }
  const reader = new FileReader()
  reader.onload = () => (form.icon = String(reader.result))
  reader.readAsDataURL(file)
}

async function saveDraft() {
  if (!account.isLoggedIn) {
    ui.openLogin()
    toast.info('登录后可跨设备保存草稿')
    return
  }
  try {
    await account.saveDraft({ ...form, step: step.value, savedAt: formatDateTime(new Date()) })
    toast.success('草稿已同步到账号')
  }
  catch (error) {
    toast.error(apiErrorMessage(error, '草稿保存失败'))
  }
}

function goStep(target: number) {
  if (target < 1 || target > 3) return
  if (target < step.value) {
    step.value = target
    errors.value = {}
    return
  }
  for (let current = step.value; current < target; current += 1) {
    const stepErrors = validateSubmissionStep(form, current)
    if (Object.keys(stepErrors).length) {
      errors.value = stepErrors
      step.value = current
      toast.error('请先完善当前步骤的必填内容')
      return
    }
  }
  errors.value = {}
  step.value = target
}

async function handleNext() {
  if (step.value < 3) {
    goStep(step.value + 1)
    return
  }

  const allErrors = validateSubmission(form)
  if (Object.keys(allErrors).length) {
    errors.value = allErrors
    const firstStep = submissionStepFields
      .findIndex(fields => fields.some(field => allErrors[field]))
    if (firstStep >= 0) step.value = firstStep + 1
    toast.error('表单还有未完成的必填项')
    return
  }

  if (!account.isLoggedIn) {
    ui.openLogin()
    toast.info('登录后即可提交收录')
    return
  }

  submitting.value = true
  try {
    const submission = await $api<Submission>('/api/submissions', { method: 'POST', body: { ...form } })
    account.addSubmission(submission)
    await account.clearDraft()
    toast.success('提交成功，审核结果将通过站内消息通知你')
    navigateTo('/profile/submissions')
  }
  catch (error) {
    errors.value = apiFieldErrors(error) as SubmissionErrors
    toast.error(apiErrorMessage(error, '提交失败，请稍后再试'))
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="submit-page" aria-labelledby="submit-page-title">
    <nav class="submit-breadcrumb" aria-label="面包屑导航">
      <NuxtLink to="/">首页</NuxtLink>
      <AppIcon name="chevron-right" class="size-3" />
      <NuxtLink to="/submit">投稿/收录</NuxtLink>
      <AppIcon name="chevron-right" class="size-3" />
      <span aria-current="page">提交网站</span>
    </nav>

    <div class="submit-layout mt-5">
      <form class="panel submit-form-panel rounded-xl" novalidate @submit.prevent="handleNext">
        <div class="submit-intro">
          <h1 id="submit-page-title" class="font-display font-extrabold text-foreground">提交收录</h1>
          <p class="mt-2 text-[13px] text-muted-foreground">分享优质网站，让更多人发现它的价值</p>
        </div>

        <ol class="submit-steps" aria-label="投稿步骤">
          <li
            v-for="item in options?.steps ?? []"
            :key="item.step"
            class="submit-step"
            :class="{ 'is-active': item.step <= step }"
          >
            <span class="submit-step__number">{{ item.step }}</span>
            <span class="submit-step__copy"><strong>{{ item.title }}</strong><span>{{ item.hint }}</span></span>
          </li>
        </ol>

        <div class="submit-section-title">
          <span>{{ currentStep?.title }}</span>
          <span class="text-[11px] font-medium text-muted-foreground">第 {{ step }} 步，共 3 步</span>
        </div>

        <!-- Step 1: basics -->
        <div v-show="step === 1" class="submit-field-grid">
          <div class="submit-field">
            <label for="submitName">网站名称 <span class="required-mark">*</span></label>
            <input
              id="submitName"
              v-model="form.name"
              class="submit-input"
              :class="{ 'is-invalid': fieldError('name') }"
              type="text"
              maxlength="50"
              placeholder="请输入网站名称"
            >
            <p v-if="fieldError('name')" class="submit-field__error">{{ fieldError('name') }}</p>
            <p v-else class="submit-field__help">请填写网站的完整名称（2-50个字符）</p>
          </div>

          <div class="submit-field">
            <label for="submitUrl">网站地址 <span class="required-mark">*</span></label>
            <input
              id="submitUrl"
              v-model="form.url"
              class="submit-input"
              :class="{ 'is-invalid': fieldError('url') }"
              type="url"
              placeholder="https://example.com"
            >
            <p v-if="fieldError('url')" class="submit-field__error">{{ fieldError('url') }}</p>
            <p v-else class="submit-field__help">请填写网站的完整地址，包含 http:// 或 https://</p>
          </div>

          <div class="submit-field">
            <span class="submit-field__label">网站图标</span>
            <div class="submit-icon-upload">
              <div class="submit-icon-preview" aria-label="网站图标预览">
                <img v-if="form.icon" :src="form.icon" alt="网站图标">
                <span v-else>{{ initialOf(previewName) }}</span>
              </div>
              <div>
                <button class="submit-upload-button" type="button" @click="pickIcon">
                  <AppIcon name="image-up" class="size-3.5" />更换图标
                </button>
                <input ref="iconInput" class="sr-only" type="file" accept="image/png,image/jpeg,image/webp" @change="onIconChange">
                <p class="submit-field__help">支持 JPG、PNG、WebP 格式，建议尺寸 512×512px 以内。</p>
              </div>
            </div>
          </div>

          <div class="submit-field">
            <label for="submitCategory">网站分类 <span class="required-mark">*</span></label>
            <select
              id="submitCategory"
              v-model="form.categorySlug"
              class="submit-select"
              :class="{ 'is-invalid': fieldError('categorySlug') }"
            >
              <option value="" disabled>请选择网站分类</option>
              <option v-for="item in options?.categories ?? []" :key="item.slug" :value="item.slug">{{ item.name }}</option>
            </select>
            <p v-if="fieldError('categorySlug')" class="submit-field__error">{{ fieldError('categorySlug') }}</p>
            <p v-else class="submit-field__help">选择最贴近网站核心功能的分类</p>
          </div>

          <div v-if="subCategories.length" class="submit-field">
            <label for="submitSubCategory">二级分类</label>
            <select id="submitSubCategory" v-model="form.navCategorySlug" class="submit-select">
              <option value="">暂不指定</option>
              <option v-for="item in subCategories" :key="item.slug" :value="item.slug">{{ item.title }}</option>
            </select>
            <p class="submit-field__help">帮助我们把网站放进更精准的子分类</p>
          </div>

          <div class="submit-field">
            <label for="submitLanguage">网站语言 <span class="required-mark">*</span></label>
            <select
              id="submitLanguage"
              v-model="form.language"
              class="submit-select"
              :class="{ 'is-invalid': fieldError('language') }"
            >
              <option v-for="item in options?.languages ?? []" :key="item" :value="item">{{ item }}</option>
            </select>
            <p v-if="fieldError('language')" class="submit-field__error">{{ fieldError('language') }}</p>
            <p v-else class="submit-field__help">选择网站主要使用的语言</p>
          </div>

          <div class="submit-field submit-field--full">
            <label for="submitSlogan">一句话描述 <span class="required-mark">*</span></label>
            <input
              id="submitSlogan"
              v-model="form.slogan"
              class="submit-input"
              :class="{ 'is-invalid': fieldError('slogan') }"
              type="text"
              maxlength="60"
              placeholder="用一句话描述这个网站的核心价值"
            >
            <p v-if="fieldError('slogan')" class="submit-field__error">{{ fieldError('slogan') }}</p>
            <p v-else class="submit-field__help">10-60 个字符，会展示在网站列表中</p>
          </div>
        </div>

        <!-- Step 2: details -->
        <div v-show="step === 2" class="submit-field-grid">
          <div class="submit-field submit-field--full">
            <label for="submitDescription">网站描述 <span class="text-muted-foreground">（支持 Markdown 格式）</span> <span class="required-mark">*</span></label>
            <div class="submit-editor" :class="{ 'is-previewing': previewing, 'is-invalid': fieldError('description') }">
              <div class="submit-editor__toolbar" aria-label="Markdown 工具栏">
                <button type="button" aria-label="加粗" @click="insertMarkdown('**')">B</button>
                <button type="button" aria-label="斜体" @click="insertMarkdown('_')"><i>I</i></button>
                <button type="button" aria-label="标题" @click="insertMarkdown('# ')">H</button>
                <button type="button" aria-label="插入链接" @click="insertMarkdown('[链接](https://)')">
                  <AppIcon name="link" class="size-3.5" />
                </button>
                <button type="button" aria-label="无序列表" @click="insertMarkdown('- ')">
                  <AppIcon name="list" class="size-3.5" />
                </button>
                <button type="button" aria-label="有序列表" @click="insertMarkdown('1. ')">
                  <AppIcon name="list-ordered" class="size-3.5" />
                </button>
                <div class="submit-editor__split">
                  <button type="button" :class="{ 'is-active': !previewing }" @click="previewing = false">编辑</button>
                  <button type="button" :class="{ 'is-active': previewing }" @click="previewing = true">预览</button>
                </div>
              </div>
              <div class="submit-editor__body">
                <textarea
                  v-model="form.description"
                  class="submit-textarea"
                  maxlength="5000"
                  placeholder="介绍网站的功能、亮点和适用人群"
                />
                <!-- eslint-disable-next-line vue/no-v-html -->
                <div class="submit-markdown-preview" aria-live="polite" v-html="markdownPreview" />
              </div>
            </div>
            <p v-if="fieldError('description')" class="submit-field__error">{{ fieldError('description') }}</p>
            <p v-else class="submit-field__help">支持 Markdown 格式，建议内容 50-5000 字（当前 {{ form.description.length }} 字）。</p>
          </div>

          <div class="submit-field submit-field--full">
            <span class="submit-field__label">标签 <span class="text-muted-foreground">（最多 10 个）</span> <span class="required-mark">*</span></span>
            <div class="submit-tags" :class="{ 'is-invalid': fieldError('tags') }">
              <span v-for="tag in form.tags" :key="tag" class="submit-tag">
                {{ tag }}
                <button type="button" :aria-label="`移除 ${tag} 标签`" @click="removeTag(tag)">
                  <AppIcon name="x" class="size-3" />
                </button>
              </span>
              <input
                v-model="tagInput"
                type="text"
                maxlength="16"
                placeholder="输入标签后按回车"
                @keydown.enter.prevent="addTag(tagInput)"
                @keydown.,.prevent="addTag(tagInput)"
              >
            </div>
            <p v-if="fieldError('tags')" class="submit-field__error">{{ fieldError('tags') }}</p>
            <p v-else class="submit-field__help">标签用于帮助用户更快发现你的产品。</p>
            <div class="mt-2 flex flex-wrap gap-1.5">
              <button
                v-for="tag in options?.suggestedTags ?? []"
                :key="tag"
                class="rounded-lg bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground transition hover:bg-accent hover:text-foreground"
                type="button"
                @click="addTag(tag)"
              >+ {{ tag }}</button>
            </div>
          </div>
        </div>

        <!-- Step 3: contact & confirmation -->
        <div v-show="step === 3" class="submit-field-grid">
          <div class="submit-field">
            <label for="submitContactName">联系人称呼 <span class="required-mark">*</span></label>
            <input
              id="submitContactName"
              v-model="form.contactName"
              class="submit-input"
              :class="{ 'is-invalid': fieldError('contactName') }"
              type="text"
              maxlength="30"
              placeholder="我们该如何称呼你"
            >
            <p v-if="fieldError('contactName')" class="submit-field__error">{{ fieldError('contactName') }}</p>
            <p v-else class="submit-field__help">用于审核结果通知</p>
          </div>

          <div class="submit-field">
            <label for="submitContactEmail">联系邮箱 <span class="required-mark">*</span></label>
            <input
              id="submitContactEmail"
              v-model="form.contactEmail"
              class="submit-input"
              :class="{ 'is-invalid': fieldError('contactEmail') }"
              type="email"
              placeholder="name@example.com"
            >
            <p v-if="fieldError('contactEmail')" class="submit-field__error">{{ fieldError('contactEmail') }}</p>
            <p v-else class="submit-field__help">审核结果会发送到该邮箱</p>
          </div>

          <div class="submit-field">
            <label for="submitContactWechat">微信 / 其他联系方式</label>
            <input id="submitContactWechat" v-model="form.contactWechat" class="submit-input" type="text" maxlength="40" placeholder="选填">
            <p class="submit-field__help">便于我们在需要时快速联系你</p>
          </div>

          <div class="submit-field">
            <label for="submitRemark">补充说明</label>
            <input id="submitRemark" v-model="form.remark" class="submit-input" type="text" maxlength="120" placeholder="选填，例如推荐理由">
            <p class="submit-field__help">最多 120 字</p>
          </div>

          <div class="submit-field submit-field--full">
            <span class="submit-field__label">信息确认</span>
            <dl class="grid gap-2 rounded-lg border border-border p-4 text-[12px] text-muted-foreground sm:grid-cols-2">
              <div class="flex gap-2"><dt class="shrink-0 text-muted-foreground">网站名称</dt><dd class="truncate font-semibold text-foreground">{{ previewName }}</dd></div>
              <div class="flex gap-2"><dt class="shrink-0 text-muted-foreground">网站地址</dt><dd class="truncate font-semibold text-foreground">{{ previewHost }}</dd></div>
              <div class="flex gap-2"><dt class="shrink-0 text-muted-foreground">分类</dt><dd class="truncate font-semibold text-foreground">{{ options?.categories.find(item => item.slug === form.categorySlug)?.name ?? '未选择' }}</dd></div>
              <div class="flex gap-2"><dt class="shrink-0 text-muted-foreground">语言</dt><dd class="truncate font-semibold text-foreground">{{ form.language }}</dd></div>
              <div class="flex gap-2 sm:col-span-2"><dt class="shrink-0 text-muted-foreground">标签</dt><dd class="truncate font-semibold text-foreground">{{ form.tags.join('、') || '未填写' }}</dd></div>
            </dl>
          </div>

          <div class="submit-field submit-field--full">
            <label class="flex items-start gap-2 text-[12px] font-medium text-muted-foreground">
              <input v-model="form.agreement" class="mt-0.5 size-4 accent-primary" type="checkbox">
              <span>我已阅读并同意《收录协议》，确认所提交的信息真实有效。</span>
            </label>
            <p v-if="fieldError('agreement')" class="submit-field__error">{{ fieldError('agreement') }}</p>
          </div>
        </div>
      </form>

      <aside class="submit-aside space-y-4" aria-label="提交帮助与预览">
        <section class="panel rounded-xl p-5">
          <h2 class="submit-aside-title"><AppIcon name="circle-help" class="size-4 text-primary" />提交须知</h2>
          <ul class="submit-notice-list">
            <li v-for="notice in options?.notices ?? []" :key="notice">
              <AppIcon name="badge-check" class="size-4" /><span>{{ notice }}</span>
            </li>
          </ul>
        </section>

        <section class="panel rounded-xl p-5">
          <h2 class="submit-aside-title"><AppIcon name="eye" class="size-4 text-primary" />效果预览</h2>
          <article class="submit-preview-card">
            <div class="submit-preview-card__head">
              <div class="submit-preview-card__icon">
                <img v-if="form.icon" :src="form.icon" alt="">
                <span v-else>{{ initialOf(previewName) }}</span>
              </div>
              <div class="min-w-0">
                <strong class="submit-preview-card__name">{{ previewName }}</strong>
                <span class="submit-preview-card__summary">{{ previewSlogan }}</span>
              </div>
            </div>
            <div class="submit-preview-card__tags">
              <span v-for="tag in previewTags" :key="tag">{{ tag }}</span>
            </div>
            <p class="submit-preview-card__description">{{ previewDescription }}</p>
            <div class="submit-preview-card__link">
              <span class="truncate">{{ previewHost }}</span>
              <AppIcon name="external-link" class="size-3.5 text-primary" />
            </div>
          </article>
          <div class="submit-preview-dots" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        </section>

        <section class="panel rounded-xl p-5">
          <h2 class="submit-aside-title"><AppIcon name="file-code-2" class="size-4 text-primary" />Markdown 支持</h2>
          <div class="submit-markdown-list">
            <span v-for="hint in options?.markdownHints ?? []" :key="hint"><code>{{ hint }}</code></span>
          </div>
          <NuxtLink to="/about/help" class="mt-5 flex items-center gap-1 text-[12px] font-semibold text-primary">
            查看完整 Markdown 语法 <AppIcon name="arrow-right" class="size-3.5" />
          </NuxtLink>
        </section>
      </aside>
    </div>

    <div class="submit-actions panel rounded-xl">
      <button v-if="step > 1" class="submit-action-button secondary" type="button" @click="goStep(step - 1)">
        上一步
      </button>
      <NuxtLink v-else to="/" class="submit-action-button secondary">取消</NuxtLink>
      <button class="submit-action-button ghost" type="button" @click="saveDraft">
        <AppIcon name="save" class="size-3.5" />保存草稿
      </button>
      <button class="submit-action-button primary" type="button" :disabled="submitting" @click="handleNext">
        {{ submitting ? '提交中…' : nextLabel }}
        <AppIcon :name="step === 3 ? 'send' : 'arrow-right'" class="size-3.5" />
      </button>
    </div>
  </section>
</template>

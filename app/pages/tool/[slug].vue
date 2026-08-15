<script setup lang="ts">
import type { Review, SeoMeta, ToolDetail } from '#shared/types'
import { useAccountStore } from '~/stores/account'
import { useUiStore } from '~/stores/ui'
import { renderMarkdown, splitOverview } from '~/utils/markdown'

interface DetailPayload {
  seo: SeoMeta
  detail: ToolDetail
  ratingOptions: Array<{ value: number, icon: string, label: string }>
}

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data, error } = await useAsyncData(
  () => `tool-${slug.value}`,
  () => $api<DetailPayload>(`/api/tools/${slug.value}`),
  { watch: [slug] },
)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: '工具不存在', fatal: true })
}

useSeoFromApi(() => data.value?.seo)

const account = useAccountStore()
const ui = useUiStore()
const toast = useToast()
const { toggleFavorite, visit, copyLink } = useToolActions()

const detail = computed(() => data.value!.detail)
const overviewParts = computed(() => {
  const [before, after] = splitOverview(detail.value.overview)
  return { before: renderMarkdown(before), after: renderMarkdown(after) }
})

const activeTab = ref<'overview' | 'related'>('overview')
const galleryOpen = ref(false)
const showAllReviews = ref(false)
const reviewOpen = ref(false)
const reviewRating = ref(0)
const reviewContent = ref('')
const reviewError = ref('')
const submittingReview = ref(false)
const localReviews = ref<Review[]>([])
const moodPicked = ref(0)

const isFavorite = computed(() => account.isFavorite(detail.value.slug))

const allReviews = computed(() => [...localReviews.value, ...detail.value.reviews])
const visibleReviews = computed(() => (showAllReviews.value ? allReviews.value : allReviews.value.slice(0, 3)))
const reviewCount = computed(() => detail.value.ratingCount + localReviews.value.length)

const ratingRows = computed(() => {
  const total = detail.value.ratingBuckets.reduce((sum, bucket) => sum + bucket.count, 0) || 1
  return detail.value.ratingBuckets.map(bucket => ({
    ...bucket,
    percent: Math.round((bucket.count / total) * 100),
  }))
})

const moods = computed(() => data.value?.ratingOptions ?? [])

onMounted(() => {
  watch(() => detail.value.slug, () => {
    localReviews.value = []
    void account.recordHistory(detail.value)
  }, { immediate: true })
})

function onFavorite() {
  toggleFavorite(detail.value)
}

async function onShare() {
  await copyLink(detail.value)
}

function onFeedback() {
  navigateTo('/feedback')
}

function pickMood(value: number) {
  if (!account.isLoggedIn) {
    ui.openLogin()
    toast.info('登录后即可评分')
    return
  }
  moodPicked.value = value
  reviewRating.value = value
  reviewOpen.value = true
}

async function like(review: Review) {
  if (!account.isLoggedIn) {
    ui.openLogin()
    toast.info('登录后即可点赞评价')
    return
  }
  try {
    const payload = await $api<{ likes: number }>(`/api/tools/${detail.value.slug}/reviews/${review.id}/like`, { method: 'POST' })
    review.likes = payload.likes
  }
  catch (error) {
    toast.error(apiErrorMessage(error, '点赞失败'))
  }
}

function openReview() {
  if (!account.isLoggedIn) {
    ui.openLogin()
    toast.info('登录后即可发表评价')
    return
  }
  reviewOpen.value = true
}

async function submitReview() {
  reviewError.value = ''
  submittingReview.value = true
  try {
    const review = await $api<Review>(`/api/tools/${detail.value.slug}/reviews`, {
      method: 'POST',
      body: {
        rating: reviewRating.value,
        content: reviewContent.value,
        author: account.user?.nickname,
      },
    })
    account.addReview(review)
    localReviews.value = [review, ...localReviews.value]
    reviewOpen.value = false
    reviewContent.value = ''
    reviewRating.value = 0
    toast.success('评价发布成功')
  }
  catch (err) {
    reviewError.value = apiErrorMessage(err)
  }
  finally {
    submittingReview.value = false
  }
}
</script>

<template>
  <div class="dashboard-grid">
    <LeftRail :active-category="detail.categorySlug" />

    <div class="detail-content min-w-0 space-y-4">
      <nav class="detail-breadcrumb" aria-label="面包屑">
        <template v-for="(crumb, index) in detail.breadcrumbs" :key="crumb.label">
          <NuxtLink v-if="crumb.to" :to="crumb.to">{{ crumb.label }}</NuxtLink>
          <span v-else class="current" aria-current="page">{{ crumb.label }}</span>
          <AppIcon v-if="index < detail.breadcrumbs.length - 1" name="chevron-right" class="size-3" />
        </template>
      </nav>

      <section class="panel rounded-xl p-5" aria-labelledby="site-title">
        <div class="site-summary">
          <div class="site-logo">
            <ToolLogo
              :domain="detail.domain"
              :name="detail.name"
              :size="48"
              img-class="size-12 rounded-xl object-cover"
              fallback-class="size-12 rounded-xl"
            />
          </div>
          <div class="site-intro">
            <div class="site-title-row">
              <h1 id="site-title" class="font-display font-bold">{{ detail.name }}</h1>
              <span v-if="detail.verified" class="site-verified" title="已验证">
                <AppIcon name="check" class="size-3" />
              </span>
            </div>
            <p class="mt-1.5 text-[13px] font-medium text-muted-foreground">{{ detail.slogan }}</p>
            <div class="mt-3 flex flex-wrap gap-2" aria-label="站点标签">
              <span v-for="tag in detail.siteTags" :key="tag" class="site-tag">{{ tag }}</span>
            </div>
          </div>
          <div class="site-control-stack">
            <div class="site-primary-row">
              <div class="site-stats" aria-label="站点数据">
                <div v-for="stat in detail.stats" :key="stat.label" class="site-stat">
                  <strong>{{ stat.value }}</strong><span>{{ stat.label }}</span>
                </div>
              </div>
              <a
                :href="detail.url"
                target="_blank"
                rel="noopener"
                class="site-primary-action"
                @click="visit(detail)"
              >访问官网 <AppIcon name="arrow-right" class="size-4" /></a>
            </div>
            <div class="site-secondary-row">
              <ClientOnly>
                <button
                  class="detail-secondary-action"
                  type="button"
                  :class="{ 'is-active': isFavorite }"
                  :aria-label="`${isFavorite ? '取消收藏' : '收藏'} ${detail.name}`"
                  :aria-pressed="isFavorite"
                  @click="onFavorite"
                >
                  <AppIcon name="star" class="size-3.5" :fill="isFavorite" />{{ isFavorite ? '已收藏' : '收藏' }}
                </button>
                <template #fallback>
                  <span class="detail-secondary-action"><AppIcon name="star" class="size-3.5" />收藏</span>
                </template>
              </ClientOnly>
              <button class="detail-secondary-action" type="button" :aria-label="`分享 ${detail.name}`" @click="onShare">
                <AppIcon name="share-2" class="size-3.5" />分享
              </button>
              <button class="detail-secondary-action" type="button" aria-label="反馈信息" @click="onFeedback">
                <AppIcon name="message-square-more" class="size-3.5" />反馈
              </button>
            </div>
          </div>
        </div>
      </section>

      <section v-if="detail.gallery" class="detail-gallery" :aria-label="`${detail.name} 官网截图集`">
        <figure class="detail-gallery__main">
          <img
            :src="detail.gallery.main.src"
            :width="detail.gallery.main.width"
            :height="detail.gallery.main.height"
            :alt="detail.gallery.main.alt"
          >
        </figure>
        <div class="detail-gallery__thumbs">
          <figure v-for="shot in detail.gallery.thumbs" :key="shot.src" class="detail-gallery__shot">
            <img :src="shot.src" :width="shot.width" :height="shot.height" :alt="shot.alt">
          </figure>
          <button
            v-if="detail.gallery.extra.length"
            class="detail-gallery__more"
            type="button"
            :aria-label="`查看另外 ${detail.gallery.extra.length} 张 ${detail.name} 截图`"
            @click="galleryOpen = true"
          >
            <strong>+{{ detail.gallery.extra.length }}</strong>
            <span>更多截图</span>
          </button>
        </div>
      </section>

      <section id="detailOverview" class="panel rounded-xl p-5" aria-labelledby="detail-tab-title">
        <div class="detail-tabs" role="tablist" aria-label="详情内容">
          <button
            class="detail-tab"
            :class="{ active: activeTab === 'overview' }"
            type="button"
            role="tab"
            :aria-selected="activeTab === 'overview'"
            @click="activeTab = 'overview'"
          >项目详情</button>
          <button
            class="detail-tab"
            :class="{ active: activeTab === 'related' }"
            type="button"
            role="tab"
            :aria-selected="activeTab === 'related'"
            @click="activeTab = 'related'"
          >相关快讯</button>
        </div>
        <div id="detail-tab-title" class="sr-only">{{ activeTab === 'overview' ? '项目详情' : '相关快讯' }}</div>

        <article v-if="activeTab === 'overview'" class="detail-prose">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="overviewParts.before" />
          <div class="detail-feature-grid">
            <div v-for="feature in detail.features" :key="feature.title" class="detail-feature">
              <span class="detail-feature-icon"><AppIcon :name="feature.icon" class="size-3.5" /></span>
              <div><strong>{{ feature.title }}</strong><span>{{ feature.description }}</span></div>
            </div>
          </div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="overviewParts.after" />
        </article>

        <div v-else aria-live="polite">
          <ul v-if="detail.news.length" class="mt-4 space-y-2">
            <li v-for="item in detail.news" :key="item.id">
              <a
                :href="item.url"
                target="_blank"
                rel="noopener"
                class="rank-row flex items-center gap-3 rounded-lg px-2 py-2.5"
              >
                <AppIcon name="newspaper" class="size-4 shrink-0 text-primary" />
                <span class="min-w-0 flex-1 truncate text-[13px] font-medium text-foreground">{{ item.title }}</span>
                <span class="shrink-0 text-[11px] text-muted">{{ item.source }} · {{ item.publishedAt }}</span>
              </a>
            </li>
          </ul>
          <div v-else class="detail-empty-tab">
            <AppIcon name="newspaper" class="mx-auto size-6 text-muted-foreground" />
            <p class="mt-3 text-[13px] font-semibold">相关快讯正在整理中</p>
          </div>
        </div>
      </section>

      <section class="panel rounded-xl p-5" aria-labelledby="reviews-title">
        <div class="flex items-center justify-between gap-4">
          <h2 id="reviews-title" class="font-display text-[17px] font-bold">
            用户评价 <span class="ml-1 text-[13px] text-muted">({{ reviewCount }})</span>
          </h2>
          <button class="site-primary-action h-9 px-4 text-[12px]" type="button" @click="openReview">写评价</button>
        </div>

        <article v-for="review in visibleReviews" :key="review.id" class="review-card mt-4 pt-4">
          <div class="flex gap-3">
            <div class="review-avatar">{{ review.avatarText }}</div>
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                <strong class="text-[13px] text-foreground">{{ review.author }}</strong>
                <span class="review-stars" :aria-label="`${review.rating} 星`">
                  <AppIcon v-for="index in review.rating" :key="index" name="star" class="size-3" fill />
                </span>
                <span class="review-meta">{{ review.rating.toFixed(1) }}</span>
              </div>
              <p class="mt-2 text-[13px] leading-6 text-muted-foreground">{{ review.content }}</p>
              <div class="mt-2 flex items-center justify-between">
                <span class="review-meta">{{ review.createdAt }}</span>
                <div class="flex gap-3 text-[11px] text-muted">
                  <button class="hover:text-foreground" type="button" @click="like(review)">
                    <AppIcon name="thumbs-up" class="mr-1 inline size-3" />{{ review.likes }}
                  </button>
                  <button class="hover:text-foreground" type="button" @click="openReview">
                    <AppIcon name="message-circle" class="mr-1 inline size-3" />回复
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>

        <EmptyState
          v-if="!allReviews.length"
          icon="message-square-text"
          title="还没有用户评价"
          description="成为第一个分享使用体验的人"
          action-label="写评价"
          @action="openReview"
        />

        <button
          v-if="allReviews.length > 3"
          class="mt-4 flex h-10 w-full items-center justify-center gap-1 rounded-lg text-[12px] font-semibold text-primary transition hover:bg-accent"
          type="button"
          @click="showAllReviews = !showAllReviews"
        >
          {{ showAllReviews ? '收起评价' : '查看全部评价' }} <AppIcon name="arrow-right" class="size-3.5" />
        </button>
      </section>

      <section v-if="detail.related.length" class="panel rounded-xl p-5" aria-labelledby="related-title">
        <div class="flex items-center justify-between">
          <h2 id="related-title" class="font-display text-[17px] font-bold">相关推荐</h2>
          <NuxtLink :to="`/category/subcategory/${detail.navCategorySlug}`" class="flex items-center gap-1 text-[12px] font-semibold text-primary">
            查看更多 <AppIcon name="arrow-right" class="size-3" />
          </NuxtLink>
        </div>
        <div class="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <ToolCard v-for="tool in detail.related" :key="tool.id" :tool="tool" />
        </div>
      </section>
    </div>

    <RightRail>
      <template #before>
        <section class="panel rounded-xl p-5" aria-labelledby="rating-title">
          <h2 id="rating-title" class="rating-card__question">这个产品有用吗？</h2>
          <p class="mt-1 text-[12px] leading-5 text-muted">选择感受，帮助更多人发现优质工具</p>
          <div class="rating-card__moods" role="group" :aria-label="`为 ${detail.name} 评分`">
            <button
              v-for="mood in moods"
              :key="mood.value"
              class="rating-mood"
              :class="{ 'is-active': moodPicked === mood.value }"
              type="button"
              :aria-label="mood.label"
              :title="mood.label"
              @click="pickMood(mood.value)"
            >
              <AppIcon :name="mood.icon" class="size-5" />
            </button>
          </div>
          <div class="rating-legend">
            <span>用户评分 {{ detail.rating }} / 5</span>
            <span>共 {{ reviewCount.toLocaleString('zh-CN') }} 人参与</span>
          </div>
          <div class="rating-bars" aria-label="评分分布">
            <div v-for="row in ratingRows" :key="row.score" class="rating-bar">
              <span>{{ row.score }} 分</span>
              <span class="rating-bar__track"><span class="rating-bar__fill" :style="{ width: `${row.percent}%` }" /></span>
              <span>{{ row.percent }}%</span>
            </div>
          </div>
          <div class="rating-summary">
            <AppIcon name="badge-check" class="size-4 text-primary" />
            <strong>{{ detail.rating }}</strong><span>综合用户反馈</span>
          </div>
        </section>
      </template>
    </RightRail>

    <BaseDialog
      :open="galleryOpen"
      dialog-class="m-auto w-[min(880px,calc(100%-32px))] rounded-2xl border-0 bg-card p-0 shadow-2xl"
      @close="galleryOpen = false"
    >
      <div class="max-h-[80dvh] overflow-y-auto p-6">
        <div class="flex items-center justify-between">
          <h2 class="font-display text-[18px] font-bold">{{ detail.name }} 截图</h2>
          <button
            class="grid size-10 place-items-center rounded-full text-muted transition hover:bg-accent hover:text-foreground"
            type="button"
            aria-label="关闭截图预览"
            @click="galleryOpen = false"
          >
            <AppIcon name="x" class="size-5" />
          </button>
        </div>
        <div class="mt-4 space-y-4">
          <img
            v-for="shot in detail.gallery?.extra ?? []"
            :key="shot.src"
            :src="shot.src"
            :width="shot.width"
            :height="shot.height"
            :alt="shot.alt"
            class="w-full rounded-xl border border-border"
          >
        </div>
      </div>
    </BaseDialog>

    <BaseDialog
      :open="reviewOpen"
      dialog-class="m-auto w-[min(480px,calc(100%-32px))] rounded-2xl border-0 bg-card p-0 shadow-2xl"
      @close="reviewOpen = false"
    >
      <form class="p-6" @submit.prevent="submitReview">
        <div class="flex items-center justify-between">
          <h2 class="font-display text-[18px] font-bold">写评价</h2>
          <button
            class="grid size-10 place-items-center rounded-full text-muted transition hover:bg-accent hover:text-foreground"
            type="button"
            aria-label="关闭评价弹窗"
            @click="reviewOpen = false"
          >
            <AppIcon name="x" class="size-5" />
          </button>
        </div>
        <p class="mt-1 text-[12px] text-muted">分享你的使用体验，帮助更多人做出选择</p>

        <div class="mt-5 flex items-center gap-1" role="group" aria-label="选择评分">
          <button
            v-for="score in 5"
            :key="score"
            class="grid size-9 place-items-center rounded-lg transition"
            :class="score <= reviewRating ? 'text-foreground' : 'text-[#c8cede] hover:text-foreground'"
            type="button"
            :aria-label="`${score} 星`"
            @click="reviewRating = score"
          >
            <AppIcon name="star" class="size-5" :fill="score <= reviewRating" />
          </button>
          <span class="ml-2 text-[12px] text-muted">{{ reviewRating ? `${reviewRating}.0` : '请选择评分' }}</span>
        </div>

        <label for="reviewContent" class="mt-4 block text-[12px] font-semibold">评价内容</label>
        <textarea
          id="reviewContent"
          v-model="reviewContent"
          class="mt-2 min-h-28 w-full rounded-lg border border-border p-3 text-[13px] outline-none transition focus:border-brand"
          maxlength="500"
          placeholder="说说这个工具好在哪里，或者哪里还可以改进…"
        />
        <p class="mt-1 text-right text-[11px] text-muted">{{ reviewContent.length }} / 500</p>

        <p v-if="reviewError" class="mt-2 text-[12px] font-medium text-destructive">{{ reviewError }}</p>

        <div class="mt-5 flex justify-end gap-2">
          <button
            class="h-10 rounded-lg border border-border px-4 text-[13px] font-semibold text-muted-foreground transition hover:bg-accent"
            type="button"
            @click="reviewOpen = false"
          >取消</button>
          <button
            class="h-10 rounded-lg bg-primary px-5 text-[13px] font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-70"
            type="submit"
            :disabled="submittingReview"
          >{{ submittingReview ? '发布中…' : '发布评价' }}</button>
        </div>
      </form>
    </BaseDialog>
  </div>
</template>

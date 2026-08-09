<script setup lang="ts">
import type { SeoMeta } from '#shared/types'

interface StaticPagePayload {
  seo: SeoMeta
  page: { slug: string, title: string, description: string, updatedAt: string, body: string }
  nav: Array<{ slug: string, title: string, to: string }>
}

const route = useRoute()
const slug = computed(() => String(route.params.slug || 'index'))

const { data, error } = await useAsyncData(
  () => `about-${slug.value}`,
  () => $api<StaticPagePayload>(`/api/pages/${slug.value}`),
  { watch: [slug] },
)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: '页面不存在', fatal: true })
}

useSeoFromApi(() => data.value?.seo)

const body = computed(() => renderMarkdown(data.value?.page.body ?? ''))
</script>

<template>
  <div class="submit-layout">
    <article class="panel rounded-xl p-7 sm:p-8" aria-labelledby="about-title">
      <nav class="submit-breadcrumb" aria-label="面包屑导航">
        <NuxtLink to="/">首页</NuxtLink>
        <AppIcon name="chevron-right" class="size-3" />
        <NuxtLink to="/about">关于</NuxtLink>
        <AppIcon name="chevron-right" class="size-3" />
        <span aria-current="page">{{ data?.page.title }}</span>
      </nav>
      <h1 id="about-title" class="mt-4 font-display text-[26px] font-extrabold leading-tight text-ink">
        {{ data?.page.title }}
      </h1>
      <p class="mt-2 text-[13px] leading-6 text-copy">{{ data?.page.description }}</p>
      <p class="mt-1 text-[11px] text-muted">最后更新于 {{ data?.page.updatedAt }}</p>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="detail-prose mt-6" v-html="body" />
    </article>

    <aside class="submit-aside space-y-4" aria-label="关于导航">
      <section class="panel rounded-xl p-5">
        <h2 class="submit-aside-title"><AppIcon name="list" class="size-4 text-brand" />相关页面</h2>
        <nav class="mt-3 space-y-1">
          <NuxtLink
            v-for="item in data?.nav ?? []"
            :key="item.slug"
            :to="item.to"
            class="side-nav-btn flex w-full items-center gap-3 rounded-lg px-3.5 text-[13px]"
            :class="{ active: item.slug === slug }"
          >
            <AppIcon name="chevron-right" class="size-3.5" />{{ item.title }}
          </NuxtLink>
        </nav>
      </section>

      <section class="panel rounded-xl p-5">
        <h2 class="submit-aside-title"><AppIcon name="send" class="size-4 text-brand" />推荐好工具</h2>
        <p class="mt-3 text-[12px] leading-6 text-muted">发现了值得收录的网站？欢迎提交给我们，审核通过后即可展示在对应分类中。</p>
        <NuxtLink to="/submit" class="submit-action-button primary mt-4 w-full">
          提交收录 <AppIcon name="arrow-right" class="size-3.5" />
        </NuxtLink>
      </section>
    </aside>
  </div>
</template>

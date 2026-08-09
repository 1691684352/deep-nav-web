<script setup lang="ts">
import type { Category, CategoryGroup, NavCategory, SeoMeta, Tool } from '#shared/types'

interface CategoryPayload {
  seo: SeoMeta
  category: Category
  categories: Category[]
  navCategories: NavCategory[]
  groups: CategoryGroup[]
  hotTools: Tool[]
  total: number
}

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data, error } = await useAsyncData(
  () => `category-${slug.value}`,
  () => $api<CategoryPayload>(`/api/categories/${slug.value}`),
  { watch: [slug] },
)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: '分类不存在', fatal: true })
}

useSeoFromApi(() => data.value?.seo)

const activeFilter = ref('全部')

const category = computed(() => data.value?.category)
const groups = computed(() => data.value?.groups ?? [])

const filterTabs = computed(() => [
  { key: '全部', label: '全部', count: data.value?.total ?? 0 },
  ...groups.value.map(group => ({ key: group.slug, label: group.title, count: group.total })),
])

function selectFilter(key: string) {
  activeFilter.value = key
  if (!import.meta.client) return
  const target = key === '全部'
    ? document.getElementById('popular-tools')
    : document.querySelector(`[data-category-section="${key}"]`)
  target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="dashboard-grid">
    <LeftRail />

    <div class="min-w-0 space-y-6">
      <section class="hero-panel category-hero rounded-xl border border-[#e6ecf8] p-7 sm:p-8" aria-labelledby="category-title">
        <div class="hero-copy relative z-10">
          <nav class="category-breadcrumb flex items-center gap-1.5 text-[12px] font-medium" aria-label="面包屑">
            <NuxtLink to="/">工具导航</NuxtLink>
            <AppIcon name="chevron-right" class="size-3.5" />
            <span>{{ category?.label }}</span>
          </nav>
          <div class="mt-4 flex items-center gap-3">
            <span class="category-title-icon" aria-hidden="true">
              <AppIcon :name="category?.icon ?? 'sparkles'" class="size-5" />
            </span>
            <h1 id="category-title" class="font-display text-[32px] font-extrabold leading-tight text-[#121827]">
              {{ category?.label }}
            </h1>
          </div>
          <p class="mt-3 max-w-[620px] text-[14px] font-medium leading-6 text-copy">{{ category?.description }}</p>
          <div class="mt-5 flex flex-wrap gap-y-3">
            <div class="category-metric"><strong>{{ data?.total ?? 0 }}</strong><span>已收录工具</span></div>
            <div class="category-metric"><strong>{{ groups.length }}</strong><span>细分方向</span></div>
            <div class="category-metric"><strong>每日更新</strong><span>持续精选</span></div>
          </div>
        </div>
        <div class="beacon" aria-hidden="true">
          <div class="beacon-glow" /><div class="beacon-ring one" /><div class="beacon-ring two" /><div class="beacon-core" />
          <div class="beacon-star"><AppIcon :name="category?.icon ?? 'sparkles'" class="size-6" /></div>
          <div class="beacon-chip left"><AppIcon name="sparkles" class="size-4" /></div>
          <div class="beacon-chip right"><AppIcon name="bot" class="size-4" /></div>
        </div>
      </section>

      <section class="panel category-filter rounded-xl px-4 py-3 sm:px-5" :aria-label="`${category?.label} 子分类`">
        <span class="category-filter__label">
          <AppIcon name="sliders-horizontal" class="size-4 text-brand" />子分类
        </span>
        <div class="category-filter__tabs" role="tablist" :aria-label="`${category?.label} 子分类`">
          <button
            v-for="tab in filterTabs"
            :key="tab.key"
            class="category-filter__tab"
            :class="{ active: activeFilter === tab.key }"
            type="button"
            role="tab"
            :aria-selected="activeFilter === tab.key"
            @click="selectFilter(tab.key)"
          >
            {{ tab.label }} <span class="count">{{ tab.count }}</span>
          </button>
        </div>
      </section>

      <section id="popular-tools" :aria-labelledby="'category-tools-title'">
        <h2 id="category-tools-title" class="sr-only">{{ category?.label }}分类列表</h2>
        <div v-if="groups.length" class="category-groups" aria-live="polite">
          <section
            v-for="group in groups"
            :key="group.slug"
            class="category-subcategory panel rounded-xl px-4 pb-4 pt-2"
            :data-category-section="group.slug"
            :aria-labelledby="`category-group-${group.slug}`"
          >
            <div class="category-subcategory__head">
              <div class="category-subcategory__title-wrap">
                <h3 :id="`category-group-${group.slug}`" class="category-subcategory__title">{{ group.title }}</h3>
                <p class="category-subcategory__desc">{{ group.description }}</p>
              </div>
              <NuxtLink class="category-subcategory__more" :to="`/category/subcategory/${group.slug}`">
                查看更多 <AppIcon name="arrow-right" class="size-3.5" />
              </NuxtLink>
            </div>
            <div class="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
              <ToolCard v-for="tool in group.tools" :key="tool.id" :tool="tool" />
            </div>
          </section>
        </div>
        <div v-else class="category-empty is-visible">
          <AppIcon name="search-x" class="mx-auto size-7" />
          <p class="mt-3 text-[13px] font-semibold">该分类暂未收录工具</p>
        </div>
      </section>
    </div>

    <RightRail />
  </div>
</template>

<script setup lang="ts">
import { useSiteStore } from '~/stores/site'

const site = useSiteStore()

const rail = computed(() => site.site?.rail)
const qrFailed = ref(false)
</script>

<template>
  <aside class="right-rail space-y-4" aria-label="导航与推荐">
    <slot name="before" />

    <NuxtLink v-if="rail" :to="rail.promo.to" class="ai-banner relative block min-h-[154px] rounded-xl p-5 text-white shadow-[0_6px_16px_rgba(106,70,222,.08)]">
      <p class="text-[20px] font-semibold">{{ rail.promo.title }}</p>
      <p class="mt-1 text-[12px] text-white/75">{{ rail.promo.subtitle }}</p>
      <span class="mt-5 inline-flex h-8 items-center gap-1 rounded-full bg-white px-3 text-[11px] font-bold text-[#6a4be3]">
        {{ rail.promo.ctaLabel }} <AppIcon name="arrow-right" class="size-3" />
      </span>
    </NuxtLink>

    <section v-if="rail && site.recommendedTools.length" class="panel rounded-xl p-5">
      <div class="flex items-center gap-2.5">
        <h2 class="font-display text-[16px] font-semibold text-[#202633]">{{ rail.recommend.title }}</h2>
        <span v-if="rail.recommend.badge" class="rounded-md bg-[#fff5d9] px-1.5 py-1 text-[10px] font-semibold leading-none text-[#d58a13]">
          {{ rail.recommend.badge }}
        </span>
      </div>
      <div class="mt-3 space-y-1">
        <RecommendRow
          v-for="(tool, index) in site.recommendedTools"
          :key="tool.id"
          :tool="tool"
          :recommended="index < 4"
        />
      </div>
    </section>

    <section v-if="rail" class="panel rounded-xl p-5">
      <div class="text-center">
        <h2 class="font-display text-[17px] font-semibold text-[#202633]">{{ rail.wechat.title }}</h2>
        <p
          v-for="(line, index) in rail.wechat.descriptions"
          :key="line"
          class="text-[12px] leading-5 text-[#7b8597]"
          :class="{ 'mt-2': index === 0 }"
        >{{ line }}</p>
      </div>
      <div class="wechat-qr" :aria-label="`${rail.wechat.title}二维码`">
        <img
          v-if="rail.wechat.qr && !qrFailed"
          :src="rail.wechat.qr"
          :alt="`${rail.wechat.title}二维码`"
          @error="qrFailed = true"
        >
        <div v-else class="qr-fallback !block" aria-hidden="true">
          <span class="qr-finder a" /><span class="qr-finder b" /><span class="qr-finder c" />
        </div>
      </div>
      <p class="mt-3 text-center text-[12px] text-[#8a94a5]">{{ rail.wechat.caption }}</p>
    </section>

    <section v-if="rail?.friendLinks.links.length" class="panel rounded-xl p-5" aria-labelledby="friend-links-title">
      <div class="flex items-center justify-between gap-3">
        <h2 id="friend-links-title" class="font-display text-[16px] font-semibold text-[#202633]">{{ rail.friendLinks.title }}</h2>
        <NuxtLink
          v-if="rail.friendLinks.actionTo"
          :to="rail.friendLinks.actionTo"
          class="flex shrink-0 items-center gap-1 text-[12px] font-medium text-brand hover:text-brand-deep"
        >
          <AppIcon name="plus" class="size-3.5" />{{ rail.friendLinks.actionLabel }}
        </NuxtLink>
      </div>
      <div class="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-[12px] leading-5 text-[#69758b]">
        <template v-for="link in rail.friendLinks.links" :key="link.id">
          <a
            v-if="link.kind === 'external'"
            :href="link.to"
            :target="link.target"
            :rel="link.rel"
            class="hover:text-brand"
          >{{ link.label }}</a>
          <NuxtLink v-else :to="link.to" class="hover:text-brand">{{ link.label }}</NuxtLink>
        </template>
      </div>
    </section>

    <section v-if="rail" class="panel rounded-xl p-5 text-[12px] leading-5 text-[#69758b]" aria-label="服务与备案信息">
      <nav v-if="rail.meta.serviceLinks.length" class="flex flex-wrap gap-x-4 gap-y-1" aria-label="服务条款">
        <NuxtLink v-for="link in rail.meta.serviceLinks" :key="link.id" :to="link.to" class="hover:text-brand">
          {{ link.label }}
        </NuxtLink>
      </nav>
      <div class="my-3 border-t border-[#edf0f5]" />
      <p>{{ rail.meta.contactLabel }}</p>
      <a :href="`mailto:${rail.meta.email}`" class="mt-0.5 block break-all text-[#52617a] hover:text-brand">{{ rail.meta.email }}</a>
      <p class="mt-3">{{ rail.meta.copyright }}</p>
      <div v-if="rail.meta.beianLinks.length" class="mt-1 flex flex-wrap gap-x-3 gap-y-1">
        <NuxtLink v-for="link in rail.meta.beianLinks" :key="link.id" :to="link.to" class="hover:text-brand">
          {{ link.label }}
        </NuxtLink>
      </div>
    </section>
  </aside>
</template>

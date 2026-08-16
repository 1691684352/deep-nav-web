<script setup lang="ts">
import { useSiteStore } from '~/stores/site'

const site = useSiteStore()

const rail = computed(() => site.site?.rail)
const qrFailed = ref(false)
</script>

<template>
  <aside class="right-rail space-y-4" aria-label="导航与推荐">
    <slot name="before" />

    <NuxtLink v-if="rail" :to="rail.promo.to" class="relative block min-h-[154px] rounded-xl border bg-primary p-5 text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5">
      <p class="text-[20px] font-semibold">{{ rail.promo.title }}</p>
      <p class="mt-1 text-[12px] text-primary-foreground/70">{{ rail.promo.subtitle }}</p>
      <span class="mt-5 inline-flex h-8 items-center gap-1 rounded-full bg-background px-3 text-[11px] font-bold text-foreground">
        {{ rail.promo.ctaLabel }} <AppIcon name="arrow-right" class="size-3" />
      </span>
    </NuxtLink>

    <section v-if="rail && site.recommendedTools.length" class="panel rounded-xl p-5">
      <div class="flex items-center gap-2.5">
        <h2 class="font-display text-[16px] font-semibold text-foreground">{{ rail.recommend.title }}</h2>
        <span v-if="rail.recommend.badge" class="rounded-md bg-secondary px-1.5 py-1 text-[10px] font-semibold leading-none text-secondary-foreground">
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
        <h2 class="font-display text-[17px] font-semibold text-foreground">{{ rail.wechat.title }}</h2>
        <p
          v-for="(line, index) in rail.wechat.descriptions"
          :key="line"
          class="text-[12px] leading-5 text-muted-foreground"
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
      <p class="mt-3 text-center text-[12px] text-muted-foreground">{{ rail.wechat.caption }}</p>
    </section>
  </aside>
</template>

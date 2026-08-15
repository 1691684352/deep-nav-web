<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useSiteStore } from '~/stores/site'

const site = useSiteStore()

const rail = computed(() => site.site?.rail)
const qrFailed = ref(false)
</script>

<template>
  <aside class="hidden flex-col gap-4 xl:flex" aria-label="导航与推荐">
    <slot name="before" />

    <NuxtLink
      v-if="rail"
      :to="rail.promo.to"
      class="block rounded-xl bg-primary p-5 text-primary-foreground transition-transform hover:-translate-y-0.5"
    >
      <p class="text-[20px] font-semibold">{{ rail.promo.title }}</p>
      <p class="mt-1 text-[12px] text-primary-foreground/75">{{ rail.promo.subtitle }}</p>
      <span class="mt-5 inline-flex h-8 items-center gap-1 rounded-full bg-background px-3 text-[11px] font-bold text-foreground">
        {{ rail.promo.ctaLabel }} <AppIcon name="arrow-right" class="size-3" />
      </span>
    </NuxtLink>

    <Card v-if="rail && site.recommendedTools.length" class="gap-3 p-5">
      <div class="flex items-center gap-2.5">
        <h2 class="font-display text-[16px] font-semibold">{{ rail.recommend.title }}</h2>
        <Badge v-if="rail.recommend.badge" variant="secondary" class="text-[10px]">{{ rail.recommend.badge }}</Badge>
      </div>
      <div class="flex flex-col gap-1">
        <RecommendRow
          v-for="(tool, index) in site.recommendedTools"
          :key="tool.id"
          :tool="tool"
          :recommended="index < 4"
        />
      </div>
    </Card>

    <Card v-if="rail" class="items-center gap-2 p-5 text-center">
      <h2 class="font-display text-[17px] font-semibold">{{ rail.wechat.title }}</h2>
      <p
        v-for="line in rail.wechat.descriptions"
        :key="line"
        class="text-[12px] leading-5 text-muted-foreground"
      >{{ line }}</p>
      <div class="mt-2 grid aspect-square w-[178px] place-items-center rounded-xl border bg-background" :aria-label="`${rail.wechat.title}二维码`">
        <img
          v-if="rail.wechat.qr && !qrFailed"
          :src="rail.wechat.qr"
          class="size-[158px] object-contain"
          :alt="`${rail.wechat.title}二维码`"
          @error="qrFailed = true"
        >
        <AppIcon v-else name="qr-code" class="size-24 text-foreground" aria-hidden="true" />
      </div>
      <p class="mt-1 text-[12px] text-muted-foreground">{{ rail.wechat.caption }}</p>
    </Card>

    <Card v-if="rail?.friendLinks.links.length" class="gap-3 p-5" aria-labelledby="friend-links-title">
      <div class="flex items-center justify-between gap-3">
        <h2 id="friend-links-title" class="font-display text-[16px] font-semibold">{{ rail.friendLinks.title }}</h2>
        <NuxtLink
          v-if="rail.friendLinks.actionTo"
          :to="rail.friendLinks.actionTo"
          class="flex shrink-0 items-center gap-1 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <AppIcon name="plus" class="size-3.5" />{{ rail.friendLinks.actionLabel }}
        </NuxtLink>
      </div>
      <div class="flex flex-wrap gap-x-3 gap-y-1.5 text-[12px] leading-5 text-muted-foreground">
        <template v-for="link in rail.friendLinks.links" :key="link.id">
          <a
            v-if="link.kind === 'external'"
            :href="link.to"
            :target="link.target"
            :rel="link.rel"
            class="transition-colors hover:text-foreground"
          >{{ link.label }}</a>
          <NuxtLink v-else :to="link.to" class="transition-colors hover:text-foreground">{{ link.label }}</NuxtLink>
        </template>
      </div>
    </Card>

    <Card v-if="rail" class="gap-0 p-5 text-[12px] leading-5 text-muted-foreground" aria-label="服务与备案信息">
      <nav v-if="rail.meta.serviceLinks.length" class="flex flex-wrap gap-x-4 gap-y-1" aria-label="服务条款">
        <NuxtLink v-for="link in rail.meta.serviceLinks" :key="link.id" :to="link.to" class="transition-colors hover:text-foreground">
          {{ link.label }}
        </NuxtLink>
      </nav>
      <Separator class="my-3" />
      <p>{{ rail.meta.contactLabel }}</p>
      <a :href="`mailto:${rail.meta.email}`" class="mt-0.5 block break-all text-foreground/80 transition-colors hover:text-foreground">{{ rail.meta.email }}</a>
      <p class="mt-3">{{ rail.meta.copyright }}</p>
      <div v-if="rail.meta.beianLinks.length" class="mt-1 flex flex-wrap gap-x-3 gap-y-1">
        <NuxtLink v-for="link in rail.meta.beianLinks" :key="link.id" :to="link.to" class="transition-colors hover:text-foreground">
          {{ link.label }}
        </NuxtLink>
      </div>
    </Card>
  </aside>
</template>

<script setup lang="ts">
import { useSiteStore } from '~/stores/site'

const site = useSiteStore()

const rail = computed(() => site.site?.rail)
const brokenQrCodes = ref(new Set<string>())
</script>

<template>
  <footer v-if="site.site" class="mt-4 border-t bg-muted/30">
    <div class="page-shell grid gap-10 py-10 lg:grid-cols-[1.4fr_2fr_1fr]">
      <div>
        <NuxtLink to="/" class="inline-flex items-center gap-3">
          <span class="logo-mark scale-75" aria-hidden="true" />
          <span class="font-display text-[18px] font-bold text-foreground">{{ site.site.name }}</span>
        </NuxtLink>
        <p class="mt-3 max-w-[300px] text-[13px] leading-6 text-muted-foreground">{{ site.site.slogan }}</p>
        <div v-if="site.site.footerSocials.length" class="mt-4 flex gap-2">
          <template v-for="social in site.site.footerSocials" :key="social.id">
            <a
              v-if="social.kind === 'external'"
              class="grid size-9 place-items-center rounded-full border text-muted-foreground transition-colors hover:border-foreground/20 hover:bg-accent hover:text-foreground"
              :href="social.to"
              :target="social.target"
              :rel="social.rel"
              :aria-label="social.label"
            >
              <AppIcon :name="social.icon ?? 'link'" class="size-4" />
            </a>
            <NuxtLink
              v-else
              class="grid size-9 place-items-center rounded-full border text-muted-foreground transition-colors hover:border-foreground/20 hover:bg-accent hover:text-foreground"
              :to="social.to"
              :aria-label="social.label"
            >
              <AppIcon :name="social.icon ?? 'link'" class="size-4" />
            </NuxtLink>
          </template>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-6 text-[13px] leading-6 text-muted-foreground">
        <div v-for="column in site.site.footerColumns" :key="column.title">
          <p class="mb-3 text-[14px] font-semibold text-foreground">{{ column.title }}</p>
          <template v-for="link in column.links" :key="link.id">
            <a
              v-if="link.kind === 'external'"
              class="mb-1.5 block transition-colors hover:text-foreground"
              :href="link.to"
              :target="link.target"
              :rel="link.rel"
            >{{ link.label }}</a>
            <NuxtLink v-else class="mb-1.5 block transition-colors hover:text-foreground" :to="link.to">{{ link.label }}</NuxtLink>
          </template>
        </div>
      </div>

      <div v-if="site.site.footerFollow.qrCodes.length">
        <p class="text-[14px] font-semibold text-foreground">{{ site.site.footerFollow.title }}</p>
        <div class="mt-3 flex gap-4">
          <div
            v-for="qr in site.site.footerFollow.qrCodes"
            :key="qr.id"
            class="grid size-[78px] place-items-center overflow-hidden rounded-lg border bg-card"
          >
            <img
              v-if="!brokenQrCodes.has(qr.id)"
              :src="qr.image"
              width="78"
              height="78"
              loading="lazy"
              class="size-full object-contain p-1"
              :alt="`${qr.label}二维码`"
              @error="brokenQrCodes.add(qr.id)"
            >
            <AppIcon v-else name="qr-code" class="size-12 text-foreground" />
          </div>
        </div>
        <div class="mt-2 flex gap-8 text-[12px] text-muted-foreground">
          <span v-for="qr in site.site.footerFollow.qrCodes" :key="qr.id">{{ qr.label }}</span>
        </div>
      </div>
    </div>

    <section
      v-if="rail?.friendLinks.links.length"
      class="page-shell border-t py-6"
      aria-labelledby="footer-friend-links-title"
    >
      <div class="flex items-center justify-between gap-3">
        <h2 id="footer-friend-links-title" class="text-[14px] font-semibold text-foreground">{{ rail.friendLinks.title }}</h2>
        <NuxtLink
          v-if="rail.friendLinks.actionTo"
          :to="rail.friendLinks.actionTo"
          class="flex shrink-0 items-center gap-1 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <AppIcon name="plus" class="size-3.5" />{{ rail.friendLinks.actionLabel }}
        </NuxtLink>
      </div>
      <div class="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[13px] leading-6 text-muted-foreground">
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
    </section>

    <div class="page-shell flex flex-col gap-4 border-t py-6 text-[12px] leading-5 text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
      <div class="flex flex-col gap-2">
        <nav v-if="rail?.meta.serviceLinks.length" class="flex flex-wrap items-center gap-x-4 gap-y-1" aria-label="服务条款">
          <NuxtLink
            v-for="link in rail.meta.serviceLinks"
            :key="link.id"
            :to="link.to"
            class="transition-colors hover:text-foreground"
          >{{ link.label }}</NuxtLink>
          <template v-if="rail?.meta.email">
            <span aria-hidden="true" class="text-border">·</span>
            <a :href="`mailto:${rail.meta.email}`" class="transition-colors hover:text-foreground">{{ rail.meta.contactLabel }} {{ rail.meta.email }}</a>
          </template>
        </nav>
        <nav v-if="rail?.meta.beianLinks.length" class="flex flex-wrap items-center gap-x-4 gap-y-1" aria-label="备案信息">
          <NuxtLink
            v-for="link in rail.meta.beianLinks"
            :key="link.id"
            :to="link.to"
            class="transition-colors hover:text-foreground"
          >{{ link.label }}</NuxtLink>
        </nav>
      </div>
      <p class="shrink-0 text-[11px] lg:text-right">{{ site.site.copyright }}</p>
    </div>
  </footer>
</template>

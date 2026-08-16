<script setup lang="ts">
import { useSiteStore } from '~/stores/site'

const site = useSiteStore()

const rail = computed(() => site.site?.rail)
const brokenQrCodes = ref(new Set<string>())
</script>

<template>
  <footer v-if="site.site" class="mt-4 border-t bg-muted/30">
    <div class="page-shell py-10">
      <!-- Top: brand on the left, QR codes on the right -->
      <div class="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div class="max-w-[360px]">
          <NuxtLink to="/" class="inline-flex items-center gap-3">
            <span class="logo-mark scale-75" aria-hidden="true" />
            <span class="font-display text-[18px] font-bold text-foreground">{{ site.site.name }}</span>
          </NuxtLink>
          <p class="mt-3 text-[13px] leading-6 text-muted-foreground">{{ site.site.slogan }}</p>
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

        <div v-if="site.site.footerFollow.qrCodes.length" class="flex gap-4">
          <div v-for="qr in site.site.footerFollow.qrCodes" :key="qr.id" class="text-center">
            <div class="grid size-[84px] place-items-center overflow-hidden rounded-xl border bg-card p-1.5">
              <img
                v-if="!brokenQrCodes.has(qr.id)"
                :src="qr.image"
                width="84"
                height="84"
                loading="lazy"
                class="size-full rounded-md object-contain"
                :alt="`${qr.label}二维码`"
                @error="brokenQrCodes.add(qr.id)"
              >
              <AppIcon v-else name="qr-code" class="size-12 text-foreground" />
            </div>
            <span class="mt-2 block text-[12px] text-muted-foreground">{{ qr.label }}</span>
          </div>
        </div>
      </div>

      <!-- Consolidated link rows: one inline row per group -->
      <nav class="mt-8 flex flex-col gap-2.5 border-t pt-6 text-[13px] text-muted-foreground" aria-label="页脚导航">
        <div v-for="column in site.site.footerColumns" :key="column.title" class="flex flex-wrap items-baseline gap-x-4 gap-y-1.5">
          <span class="w-14 shrink-0 font-semibold text-foreground">{{ column.title }}</span>
          <template v-for="link in column.links" :key="link.id">
            <a
              v-if="link.kind === 'external'"
              class="transition-colors hover:text-foreground"
              :href="link.to"
              :target="link.target"
              :rel="link.rel"
            >{{ link.label }}</a>
            <NuxtLink v-else class="transition-colors hover:text-foreground" :to="link.to">{{ link.label }}</NuxtLink>
          </template>
        </div>

        <div v-if="rail?.friendLinks.links.length" class="flex flex-wrap items-baseline gap-x-4 gap-y-1.5">
          <span class="w-14 shrink-0 font-semibold text-foreground">{{ rail.friendLinks.title }}</span>
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
          <NuxtLink
            v-if="rail.friendLinks.actionTo"
            :to="rail.friendLinks.actionTo"
            class="flex items-center gap-1 text-[12px] font-medium text-foreground/70 transition-colors hover:text-foreground"
          >
            <AppIcon name="plus" class="size-3.5" />{{ rail.friendLinks.actionLabel }}
          </NuxtLink>
        </div>
      </nav>
    </div>

    <!-- Bottom bar -->
    <div class="border-t bg-background/40">
      <div class="page-shell flex flex-col gap-3 py-5 text-[12px] leading-5 text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span class="text-[12px] text-foreground/80">{{ site.site.copyright }}</span>
          <template v-for="link in rail?.meta.beianLinks ?? []" :key="link.id">
            <NuxtLink :to="link.to" class="transition-colors hover:text-foreground">{{ link.label }}</NuxtLink>
          </template>
        </div>
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <NuxtLink
            v-for="link in rail?.meta.serviceLinks ?? []"
            :key="link.id"
            :to="link.to"
            class="transition-colors hover:text-foreground"
          >{{ link.label }}</NuxtLink>
          <a
            v-if="rail?.meta.email"
            :href="`mailto:${rail.meta.email}`"
            class="transition-colors hover:text-foreground"
          >{{ rail.meta.email }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>

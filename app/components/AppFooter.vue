<script setup lang="ts">
import { useSiteStore } from '~/stores/site'

const site = useSiteStore()

const rail = computed(() => site.site?.rail)
const brokenQrCodes = ref(new Set<string>())
</script>

<template>
  <footer v-if="site.site" class="mt-4 border-t bg-muted/30">
    <div class="page-shell py-12">
      <div class="grid gap-x-8 gap-y-10 lg:grid-cols-12">
        <!-- Brand -->
        <div class="lg:col-span-4">
          <NuxtLink to="/" class="inline-flex items-center gap-3">
            <span class="logo-mark scale-75" aria-hidden="true" />
            <span class="font-display text-[18px] font-bold text-foreground">{{ site.site.name }}</span>
          </NuxtLink>
          <p class="mt-4 max-w-[300px] text-[13px] leading-6 text-muted-foreground">{{ site.site.slogan }}</p>
          <div v-if="site.site.footerSocials.length" class="mt-5 flex gap-2">
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

        <!-- Nav columns -->
        <nav class="grid grid-cols-3 gap-6 text-[13px] leading-6 text-muted-foreground lg:col-span-5" aria-label="页脚导航">
          <div v-for="column in site.site.footerColumns" :key="column.title">
            <p class="mb-3 text-[13px] font-semibold text-foreground">{{ column.title }}</p>
            <template v-for="link in column.links" :key="link.id">
              <a
                v-if="link.kind === 'external'"
                class="mb-2 block w-fit transition-colors hover:text-foreground"
                :href="link.to"
                :target="link.target"
                :rel="link.rel"
              >{{ link.label }}</a>
              <NuxtLink v-else class="mb-2 block w-fit transition-colors hover:text-foreground" :to="link.to">{{ link.label }}</NuxtLink>
            </template>
          </div>
        </nav>

        <!-- Follow -->
        <div v-if="site.site.footerFollow.qrCodes.length" class="lg:col-span-3">
          <p class="mb-3 text-[13px] font-semibold text-foreground">{{ site.site.footerFollow.title }}</p>
          <div class="flex gap-4">
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
      </div>

      <!-- Friend links -->
      <div v-if="rail?.friendLinks.links.length" class="mt-10 border-t pt-8">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <span class="h-4 w-1 rounded-full bg-foreground" aria-hidden="true" />
            <h2 class="text-[13px] font-semibold text-foreground">{{ rail.friendLinks.title }}</h2>
          </div>
          <NuxtLink
            v-if="rail.friendLinks.actionTo"
            :to="rail.friendLinks.actionTo"
            class="flex shrink-0 items-center gap-1 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <AppIcon name="plus" class="size-3.5" />{{ rail.friendLinks.actionLabel }}
          </NuxtLink>
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          <template v-for="link in rail.friendLinks.links" :key="link.id">
            <a
              v-if="link.kind === 'external'"
              :href="link.to"
              :target="link.target"
              :rel="link.rel"
              class="rounded-md border border-border/70 bg-card px-2.5 py-1 text-[12px] text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
            >{{ link.label }}</a>
            <NuxtLink
              v-else
              :to="link.to"
              class="rounded-md border border-border/70 bg-card px-2.5 py-1 text-[12px] text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
            >{{ link.label }}</NuxtLink>
          </template>
        </div>
      </div>
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

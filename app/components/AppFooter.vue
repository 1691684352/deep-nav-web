<script setup lang="ts">
import { useSiteStore } from '~/stores/site'

const site = useSiteStore()

const rail = computed(() => site.site?.rail)
// Merge the three footer groups into one flat list for a single centered nav row.
const navLinks = computed(() => (site.site?.footerColumns ?? []).flatMap(column => column.links))
const brokenQrCodes = ref(new Set<string>())
</script>

<template>
  <footer v-if="site.site" class="mt-4 border-t bg-muted/30">
    <div class="page-shell py-8">
      <!-- Main: brand + nav on the left, QR codes on the right -->
      <div class="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div class="min-w-0">
          <div class="flex items-center gap-4">
            <NuxtLink to="/" class="inline-flex shrink-0 items-center gap-2.5">
              <span class="logo-mark scale-75" aria-hidden="true" />
              <span class="font-display text-[18px] font-bold text-foreground">{{ site.site.name }}</span>
            </NuxtLink>
            <p class="truncate text-[13px] text-muted-foreground">{{ site.site.slogan }}</p>
          </div>

          <!-- Primary nav merged into one row -->
          <nav
            v-if="navLinks.length"
            class="mt-5 flex flex-wrap items-center gap-x-1 gap-y-2 text-[13px] text-muted-foreground"
            aria-label="页脚导航"
          >
            <template v-for="(link, index) in navLinks" :key="link.id">
              <span v-if="index > 0" class="select-none text-border" aria-hidden="true">·</span>
              <a
                v-if="link.kind === 'external'"
                class="px-1.5 transition-colors hover:text-foreground"
                :href="link.to"
                :target="link.target"
                :rel="link.rel"
              >{{ link.label }}</a>
              <NuxtLink v-else class="px-1.5 transition-colors hover:text-foreground" :to="link.to">{{ link.label }}</NuxtLink>
            </template>
          </nav>

          <div v-if="site.site.footerSocials.length" class="mt-5 flex gap-2">
            <template v-for="social in site.site.footerSocials" :key="social.id">
              <a
                v-if="social.kind === 'external'"
                class="grid size-8 place-items-center rounded-full border text-muted-foreground transition-colors hover:border-foreground/20 hover:bg-accent hover:text-foreground"
                :href="social.to"
                :target="social.target"
                :rel="social.rel"
                :aria-label="social.label"
              >
                <AppIcon :name="social.icon ?? 'link'" class="size-4" />
              </a>
              <NuxtLink
                v-else
                class="grid size-8 place-items-center rounded-full border text-muted-foreground transition-colors hover:border-foreground/20 hover:bg-accent hover:text-foreground"
                :to="social.to"
                :aria-label="social.label"
              >
                <AppIcon :name="social.icon ?? 'link'" class="size-4" />
              </NuxtLink>
            </template>
          </div>
        </div>

        <div v-if="site.site.footerFollow.qrCodes.length" class="flex shrink-0 gap-4">
          <div v-for="qr in site.site.footerFollow.qrCodes" :key="qr.id" class="text-center">
            <div class="grid size-[72px] place-items-center overflow-hidden rounded-xl border bg-card p-1.5">
              <img
                v-if="!brokenQrCodes.has(qr.id)"
                :src="qr.image"
                width="72"
                height="72"
                loading="lazy"
                class="size-full rounded-md object-contain"
                :alt="`${qr.label}二维码`"
                @error="brokenQrCodes.add(qr.id)"
              >
              <AppIcon v-else name="qr-code" class="size-10 text-foreground" />
            </div>
            <span class="mt-1.5 block text-[11px] text-muted-foreground">{{ qr.label }}</span>
          </div>
        </div>
      </div>

      <!-- Friend links, quiet single line -->
      <div
        v-if="rail?.friendLinks.links.length"
        class="mt-7 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 border-t pt-5 text-[12px] text-muted-foreground/80"
      >
        <span class="font-medium text-foreground/70">{{ rail.friendLinks.title }}</span>
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
          class="inline-flex items-center gap-1 font-medium text-foreground/70 transition-colors hover:text-foreground"
        >
          <AppIcon name="plus" class="size-3.5" />{{ rail.friendLinks.actionLabel }}
        </NuxtLink>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t bg-background/40">
      <div class="page-shell flex flex-col gap-2 py-4 text-[12px] leading-5 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span class="text-foreground/80">{{ site.site.copyright }}</span>
          <NuxtLink
            v-for="link in rail?.meta.beianLinks ?? []"
            :key="link.id"
            :to="link.to"
            class="transition-colors hover:text-foreground"
          >{{ link.label }}</NuxtLink>
        </div>
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
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

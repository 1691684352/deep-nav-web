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
    <div class="page-shell flex flex-col items-center py-12 text-center">
      <!-- Brand -->
      <NuxtLink to="/" class="inline-flex items-center gap-2.5">
        <span class="logo-mark scale-75" aria-hidden="true" />
        <span class="font-display text-[18px] font-bold text-foreground">{{ site.site.name }}</span>
      </NuxtLink>
      <p class="mt-3 max-w-[420px] text-[13px] leading-6 text-muted-foreground">{{ site.site.slogan }}</p>

      <!-- Primary nav, merged into one centered row -->
      <nav
        v-if="navLinks.length"
        class="mt-6 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2 text-[13px] text-muted-foreground"
        aria-label="页脚导航"
      >
        <template v-for="(link, index) in navLinks" :key="link.id">
          <span v-if="index > 0" class="select-none text-border" aria-hidden="true">·</span>
          <a
            v-if="link.kind === 'external'"
            class="px-1 transition-colors hover:text-foreground"
            :href="link.to"
            :target="link.target"
            :rel="link.rel"
          >{{ link.label }}</a>
          <NuxtLink v-else class="px-1 transition-colors hover:text-foreground" :to="link.to">{{ link.label }}</NuxtLink>
        </template>
      </nav>

      <!-- Social + QR grouped tightly under the nav -->
      <div class="mt-7 flex flex-col items-center gap-6">
        <div v-if="site.site.footerSocials.length" class="flex gap-2">
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

        <div v-if="site.site.footerFollow.qrCodes.length" class="flex gap-4">
          <div v-for="qr in site.site.footerFollow.qrCodes" :key="qr.id" class="text-center">
            <div class="grid size-[80px] place-items-center overflow-hidden rounded-xl border bg-card p-1.5">
              <img
                v-if="!brokenQrCodes.has(qr.id)"
                :src="qr.image"
                width="80"
                height="80"
                loading="lazy"
                class="size-full rounded-md object-contain"
                :alt="`${qr.label}二维码`"
                @error="brokenQrCodes.add(qr.id)"
              >
              <AppIcon v-else name="qr-code" class="size-11 text-foreground" />
            </div>
            <span class="mt-2 block text-[12px] text-muted-foreground">{{ qr.label }}</span>
          </div>
        </div>
      </div>

      <!-- Friend links, quieter and folded in -->
      <div
        v-if="rail?.friendLinks.links.length"
        class="mt-8 flex max-w-[720px] flex-wrap items-center justify-center gap-x-4 gap-y-1.5 border-t pt-6 text-[12px] text-muted-foreground/80"
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
      <div class="page-shell flex flex-col items-center gap-2 py-5 text-[12px] leading-5 text-muted-foreground sm:flex-row sm:justify-center sm:gap-x-4">
        <span class="text-foreground/80">{{ site.site.copyright }}</span>
        <template v-for="link in rail?.meta.beianLinks ?? []" :key="link.id">
          <NuxtLink :to="link.to" class="transition-colors hover:text-foreground">{{ link.label }}</NuxtLink>
        </template>
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
  </footer>
</template>

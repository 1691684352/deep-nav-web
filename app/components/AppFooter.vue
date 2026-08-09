<script setup lang="ts">
import { useSiteStore } from '~/stores/site'

const site = useSiteStore()

const brokenQrCodes = ref(new Set<string>())
</script>

<template>
  <footer v-if="site.site" class="mt-4 border-t border-[#e9edf4] bg-white/55">
    <div class="page-shell grid gap-10 py-10 lg:grid-cols-[1.4fr_2fr_1fr]">
      <div>
        <NuxtLink to="/" class="inline-flex items-center gap-3">
          <span class="logo-mark scale-75" aria-hidden="true" />
          <span class="font-display text-[18px] font-extrabold">{{ site.site.name }}</span>
        </NuxtLink>
        <p class="mt-3 max-w-[300px] text-[13px] leading-6 text-muted">{{ site.site.slogan }}</p>
        <div v-if="site.site.footerSocials.length" class="mt-4 flex gap-2">
          <template v-for="social in site.site.footerSocials" :key="social.id">
            <a
              v-if="social.kind === 'external'"
              class="grid size-9 place-items-center rounded-full border border-line text-muted hover:border-brand/30 hover:text-brand"
              :href="social.to"
              :target="social.target"
              :rel="social.rel"
              :aria-label="social.label"
            >
              <AppIcon :name="social.icon ?? 'link'" class="size-4" />
            </a>
            <NuxtLink
              v-else
              class="grid size-9 place-items-center rounded-full border border-line text-muted hover:border-brand/30 hover:text-brand"
              :to="social.to"
              :aria-label="social.label"
            >
              <AppIcon :name="social.icon ?? 'link'" class="size-4" />
            </NuxtLink>
          </template>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-6 text-[13px] leading-6 text-muted">
        <div v-for="column in site.site.footerColumns" :key="column.title">
          <p class="mb-3 text-[14px] font-bold text-ink">{{ column.title }}</p>
          <template v-for="link in column.links" :key="link.id">
            <a
              v-if="link.kind === 'external'"
              class="mb-1.5 block hover:text-brand"
              :href="link.to"
              :target="link.target"
              :rel="link.rel"
            >{{ link.label }}</a>
            <NuxtLink v-else class="mb-1.5 block hover:text-brand" :to="link.to">{{ link.label }}</NuxtLink>
          </template>
        </div>
      </div>

      <div v-if="site.site.footerFollow.qrCodes.length">
        <p class="text-[14px] font-bold">{{ site.site.footerFollow.title }}</p>
        <div class="mt-3 flex gap-4">
          <div
            v-for="qr in site.site.footerFollow.qrCodes"
            :key="qr.id"
            class="grid size-[78px] place-items-center overflow-hidden rounded-lg border border-line bg-white"
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
            <AppIcon v-else name="qr-code" class="size-12 text-ink" />
          </div>
        </div>
        <div class="mt-2 flex gap-8 text-[12px] text-muted">
          <span v-for="qr in site.site.footerFollow.qrCodes" :key="qr.id">{{ qr.label }}</span>
        </div>
      </div>

      <p class="text-[11px] text-muted lg:col-span-3 lg:text-center">{{ site.site.copyright }}</p>
    </div>
  </footer>
</template>

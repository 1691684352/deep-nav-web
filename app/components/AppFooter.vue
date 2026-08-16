<script setup lang="ts">
import { useSiteStore } from '~/stores/site'

const site = useSiteStore()

const rail = computed(() => site.site?.rail)
// Keep the titled columns (导航 / 服务 / 关于) for a structured multi-column footer.
const footerColumns = computed(() => site.site?.footerColumns ?? [])
const brokenQrCodes = ref(new Set<string>())
</script>

<template>
  <footer v-if="site.site" class="mt-4 border-t bg-muted/30">
    <div class="page-shell py-8 sm:py-12">
      <!-- Structured grid: brand · link columns · follow -->
      <div class="grid gap-8 lg:gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)_auto]">
        <!-- Brand -->
        <div class="min-w-0">
          <NuxtLink to="/" class="inline-flex items-center gap-2.5">
            <span class="logo-mark scale-75" aria-hidden="true" />
            <span class="font-display text-[18px] font-bold text-foreground">{{ site.site.name }}</span>
          </NuxtLink>
          <p class="mt-4 max-w-[280px] text-[13px] leading-6 text-muted-foreground">{{ site.site.slogan }}</p>

          <div v-if="site.site.footerSocials?.length" class="mt-6 flex gap-2">
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

        <!-- Titled link columns -->
        <div class="grid grid-cols-3 gap-4 sm:gap-8">
          <nav v-for="column in footerColumns" :key="column.title" aria-label="页脚导航">
            <h3 class="text-[13px] font-semibold text-foreground">{{ column.title }}</h3>
            <ul class="mt-3 flex flex-col gap-2.5 text-[13px] text-muted-foreground sm:mt-4 sm:gap-3">
              <li v-for="link in column.links" :key="link.id">
                <a
                  v-if="link.kind === 'external'"
                  class="transition-colors hover:text-foreground"
                  :href="link.to"
                  :target="link.target"
                  :rel="link.rel"
                >{{ link.label }}</a>
                <NuxtLink v-else class="transition-colors hover:text-foreground" :to="link.to">{{ link.label }}</NuxtLink>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Follow / QR codes -->
        <div v-if="site.site.footerFollow?.qrCodes?.length" class="min-w-0">
          <h3 class="text-[13px] font-semibold text-foreground">关注我们</h3>
          <div class="mt-4 flex gap-4">
            <div v-for="qr in site.site.footerFollow.qrCodes" :key="qr.id" class="text-center">
              <div class="grid size-[76px] place-items-center overflow-hidden rounded-xl border bg-card p-1.5">
                <img
                  v-if="!brokenQrCodes.has(qr.id)"
                  :src="qr.image"
                  width="76"
                  height="76"
                  loading="lazy"
                  class="size-full rounded-md object-contain"
                  :alt="`${qr.label}二维码`"
                  @error="brokenQrCodes.add(qr.id)"
                >
                <AppIcon v-else name="qr-code" class="size-10 text-foreground" />
              </div>
              <span class="mt-2 block text-[11px] text-muted-foreground">{{ qr.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Friend links, quiet single line -->
      <div
        v-if="rail?.friendLinks?.links?.length"
        class="mt-10 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 border-t pt-6 text-[12px] text-muted-foreground/80"
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
    <div>
      <div class="page-shell flex flex-col gap-2 pb-8 text-[12px] leading-5 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
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

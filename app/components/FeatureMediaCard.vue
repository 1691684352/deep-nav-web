<script setup lang="ts">
import type { FeatureCard } from '#shared/types'

const props = defineProps<{ card: FeatureCard }>()
</script>

<template>
  <NuxtLink
    :to="props.card.to"
    class="feature-card feature-media-card overflow-hidden rounded-xl"
    :aria-label="`浏览 ${props.card.name} 工具`"
  >
    <img class="feature-media-card__background" :src="props.card.background" width="960" height="600" alt="">
    <span class="feature-media-card__content">
      <span class="feature-media-card__logo-wrap">
        <img class="feature-media-card__logo" :src="props.card.logo" width="80" height="80" :alt="props.card.name">
      </span>
      <span class="feature-media-card__copy">
        <strong class="feature-media-card__title">{{ props.card.name }}</strong>
        <span class="feature-media-card__description">{{ props.card.description }}</span>
      </span>
    </span>
  </NuxtLink>
</template>

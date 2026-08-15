<script setup lang="ts">
import type { FavoriteItem, HistoryItem } from '#shared/types'
import { faviconUrl, initialOf } from '#shared/utils'

const props = defineProps<{
  item: FavoriteItem | HistoryItem
  time?: string
  removable?: boolean
}>()

defineEmits<{ remove: [slug: string] }>()
</script>

<template>
  <div class="profile-activity-row group">
    <NuxtLink :to="`/tool/${props.item.toolSlug}`" class="profile-activity-logo" :aria-label="`${props.item.name} 详情`">
      <b>{{ initialOf(props.item.name) }}</b>
      <img :src="faviconUrl(props.item.domain)" width="32" height="32" loading="lazy" alt="">
    </NuxtLink>
    <NuxtLink :to="`/tool/${props.item.toolSlug}`" class="min-w-0">
      <strong class="profile-activity-title">{{ props.item.name }}</strong>
      <span class="profile-activity-desc">{{ props.item.desc }}</span>
    </NuxtLink>
    <span class="profile-activity-meta">
      <b class="profile-category-chip">{{ props.item.category }}</b>
      <time v-if="props.time">{{ props.time }}</time>
      <button
        v-if="props.removable"
        class="text-[10px] font-semibold text-muted-foreground transition hover:text-destructive"
        type="button"
        :aria-label="`移除 ${props.item.name}`"
        @click="$emit('remove', props.item.toolSlug)"
      >移除</button>
    </span>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'

withDefaults(defineProps<{
  icon?: string
  title?: string
  description?: string
  actionLabel?: string
}>(), {
  icon: 'search-x',
  title: '没有找到匹配的内容',
  description: '',
  actionLabel: '',
})

defineEmits<{ action: [] }>()
</script>

<template>
  <div class="flex flex-col items-center py-10 text-center">
    <div class="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
      <AppIcon :name="icon" class="size-6" />
    </div>
    <p class="mt-3 text-[13px] font-semibold">{{ title }}</p>
    <p v-if="description" class="mt-1 text-[12px] text-muted-foreground">{{ description }}</p>
    <Button
      v-if="actionLabel"
      variant="link"
      size="sm"
      class="mt-1"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </Button>
  </div>
</template>

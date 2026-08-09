<script setup lang="ts">
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
  <div class="py-10 text-center">
    <AppIcon :name="icon" class="mx-auto size-7 text-[#a5aec0]" />
    <p class="mt-3 text-[13px] font-semibold">{{ title }}</p>
    <p v-if="description" class="mt-1 text-[12px] text-muted">{{ description }}</p>
    <button
      v-if="actionLabel"
      class="mt-2 text-[12px] font-semibold text-brand"
      type="button"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>

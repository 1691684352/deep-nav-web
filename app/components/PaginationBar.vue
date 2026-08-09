<script setup lang="ts">
const props = withDefaults(defineProps<{
  page: number
  totalPages: number
  label?: string
  /** Maximum number buttons rendered before collapsing with ellipsis. */
  window?: number
}>(), {
  label: '分页导航',
  window: 7,
})

const emit = defineEmits<{ change: [page: number] }>()

const pages = computed<Array<number | '...'>>(() => {
  const total = props.totalPages
  if (total <= props.window) return Array.from({ length: total }, (_, index) => index + 1)

  const current = props.page
  const result: Array<number | '...'> = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) result.push('...')
  for (let page = start; page <= end; page += 1) result.push(page)
  if (end < total - 1) result.push('...')
  result.push(total)
  return result
})

function go(page: number) {
  if (page < 1 || page > props.totalPages || page === props.page) return
  emit('change', page)
}
</script>

<template>
  <nav v-if="props.totalPages > 1" class="detail-pagination" :aria-label="props.label">
    <button
      class="detail-pagination__button"
      type="button"
      :disabled="props.page === 1"
      aria-label="上一页"
      @click="go(props.page - 1)"
    >
      <AppIcon name="chevron-left" class="size-4" />
    </button>
    <template v-for="(item, index) in pages" :key="`${item}-${index}`">
      <span v-if="item === '...'" class="detail-pagination__button cursor-default">…</span>
      <button
        v-else
        class="detail-pagination__button"
        :class="{ active: item === props.page }"
        type="button"
        :aria-current="item === props.page ? 'page' : 'false'"
        @click="go(item)"
      >{{ item }}</button>
    </template>
    <button
      class="detail-pagination__button"
      type="button"
      :disabled="props.page === props.totalPages"
      aria-label="下一页"
      @click="go(props.page + 1)"
    >
      <AppIcon name="chevron-right" class="size-4" />
    </button>
  </nav>
</template>

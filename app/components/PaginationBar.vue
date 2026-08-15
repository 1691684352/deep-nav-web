<script setup lang="ts">
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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

const iconBtn = cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'size-9')
</script>

<template>
  <nav v-if="props.totalPages > 1" class="flex items-center justify-center gap-1.5" :aria-label="props.label">
    <button
      :class="iconBtn"
      type="button"
      :disabled="props.page === 1"
      aria-label="上一页"
      @click="go(props.page - 1)"
    >
      <AppIcon name="chevron-left" class="size-4" />
    </button>
    <template v-for="(item, index) in pages" :key="`${item}-${index}`">
      <span v-if="item === '...'" class="grid size-9 place-items-center text-sm text-muted-foreground">…</span>
      <button
        v-else
        :class="cn(buttonVariants({ variant: item === props.page ? 'default' : 'outline', size: 'icon' }), 'size-9')"
        type="button"
        :aria-current="item === props.page ? 'page' : undefined"
        @click="go(item)"
      >{{ item }}</button>
    </template>
    <button
      :class="iconBtn"
      type="button"
      :disabled="props.page === props.totalPages"
      aria-label="下一页"
      @click="go(props.page + 1)"
    >
      <AppIcon name="chevron-right" class="size-4" />
    </button>
  </nav>
</template>

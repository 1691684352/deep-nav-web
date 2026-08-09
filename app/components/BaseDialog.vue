<script setup lang="ts">
const props = withDefaults(defineProps<{
  open: boolean
  dialogClass?: string
  closeOnBackdrop?: boolean
}>(), {
  dialogClass: '',
  closeOnBackdrop: true,
})

const emit = defineEmits<{ close: [] }>()

const dialog = ref<HTMLDialogElement | null>(null)

function sync(open: boolean) {
  const element = dialog.value
  if (!element) return
  if (open && !element.open) element.showModal()
  if (!open && element.open) element.close()
}

watch(() => props.open, async (open) => {
  await nextTick()
  sync(open)
})

onMounted(() => sync(props.open))

/** Native dialogs report backdrop clicks as clicks on the dialog element itself. */
function onClick(event: MouseEvent) {
  if (!props.closeOnBackdrop) return
  if (event.target === dialog.value) emit('close')
}
</script>

<template>
  <dialog
    ref="dialog"
    :class="props.dialogClass"
    @close="emit('close')"
    @cancel.prevent="emit('close')"
    @click="onClick"
  >
    <slot />
  </dialog>
</template>

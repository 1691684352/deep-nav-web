<script setup lang="ts">
const props = defineProps<{
  activeCategory?: string
  activeAction?: string
}>()
</script>

<template>
  <aside class="left-rail sticky space-y-4" aria-label="分类导航">
    <SideNavPanel :active-category="props.activeCategory" :active-action="props.activeAction" />
  </aside>
</template>

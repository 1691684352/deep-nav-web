<script setup lang="ts">
const props = defineProps<{
  activeCategory?: string
  activeAction?: string
}>()
</script>

<template>
  <aside class="sticky top-20 hidden lg:block" aria-label="分类导航">
    <SideNavPanel :active-category="props.activeCategory" :active-action="props.activeAction" />
  </aside>
</template>

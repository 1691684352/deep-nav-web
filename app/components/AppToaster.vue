<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
</script>

<template>
  <ClientOnly>
    <Toaster position="bottom-center" :rich-colors="true" :duration="2600" />
  </ClientOnly>
</template>

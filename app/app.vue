<script setup lang="ts">
// Site-wide structured data: WebSite (with sitelinks search box) + Organization.
const abs = useAbsoluteUrl()
useJsonLd('website', {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  'name': '深度指引',
  'url': abs('/'),
  'inLanguage': 'zh-CN',
  'potentialAction': {
    '@type': 'SearchAction',
    'target': {
      '@type': 'EntryPoint',
      'urlTemplate': `${abs('/search')}?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  'publisher': {
    '@type': 'Organization',
    'name': '深度指引',
    'url': abs('/'),
    'logo': abs('/assets/deepseek-site-preview.png'),
  },
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

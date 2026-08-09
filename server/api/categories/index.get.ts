export default defineEventHandler(() => ok({
  categories: categoriesWithCounts(),
  navCategories: navCategoriesWithCounts(),
}))

<template>
  <div class="categories-page">
    <h1>Categories</h1>
    <div class="categories-grid">
      <Category
        v-for="(category, index) in categories"
        :key="index"
        :title="category.title"
        :count="category.count"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Category from "@/components/Category.vue";

export default {
  name: "CategoriesView",
  components: {
    Category,
  },
  data() {
    return {
      categories: [
        { title: "Beef", count: 1 },
        { title: "Breakfast", count: 2 },
        { title: "Carrots", count: 3 },
        { title: "Dinner", count: 4 },
        { title: "Food", count: 1 },
      ],
    };
  },
};
</script>

<style scoped>
.categories-page {
  padding: 2rem;
  text-align: center;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

h1 {
  font-size: 2rem;
  color: #333;
}
</style>

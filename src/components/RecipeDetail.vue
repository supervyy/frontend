<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ name: string }>()

const recipes = ref([
  {
    id: 1,
    name: "Korean Fried Chicken",
    description: "Crispy and flavorful chicken with a spicy glaze.",
    image: "https://i.pinimg.com/736x/7f/4e/54/7f4e542859a08ac78396d4d63ccd7a10.jpg",
    category: "Appetizers",
    author: "Noobanh",
  },
  {
    id: 2,
    name: "Spaghetti Carbonara",
    description: "Classic Italian pasta with creamy sauce.",
    image: "https://i.pinimg.com/736x/fe/07/27/fe072747470c09eeadfcac3f450a130e.jpg",
    category: "Main Course",
    author: "Chef Luigi",
  },
  {
    id: 3,
    name: "Matcha Latte",
    description: "Refreshing green tea latte with a creamy texture.",
    image: "https://i.pinimg.com/736x/3d/f0/38/3df0387ca10b830837f1bf2f80559762.jpg",
    category: "Drinks",
    author: "Tea Lover",
  },
  {
    id: 4,
    name: "Tiramisu",
    image: "https://i.pinimg.com/736x/eb/67/cd/eb67cdd4329512df261dcde1dce229f9.jpg",
  },

]);
onMounted(() => {
  const recipeId = parseInt(route.params.id as string, 10);
  recipe.value = recipes.find((r) => r.id === recipeId) || null;
});

</script>

<template>
  <div class="recipe-detail">
    <div v-if="recipe" class="detail-container">
      <h1 class="recipe-title">{{ recipe.name }}</h1>
      <img :src="recipe.image" alt="Recipe image" class="recipe-image" />
      <p class="recipe-description">{{ recipe.description }}</p>
    </div>
    <div v-else class="error-page">
      <h2>Recipe not found</h2>
    </div>
  </div>

</template>

<style scoped>
.error-page {
  color: red;
}

</style>

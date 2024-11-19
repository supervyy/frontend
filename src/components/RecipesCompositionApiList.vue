<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ title: string }>()
const recipes = ref([
  {
    id: 1,
    name: "Korean Fried Chicken",
    image: "https://i.pinimg.com/736x/7f/4e/54/7f4e542859a08ac78396d4d63ccd7a10.jpg",
  },
  {
    id: 2,
    name: "Spaghetti Carbonara",
    image: "https://i.pinimg.com/736x/fe/07/27/fe072747470c09eeadfcac3f450a130e.jpg",
  },
  {
    id: 3,
    name: "Matcha Latte",
    image: "https://i.pinimg.com/736x/3d/f0/38/3df0387ca10b830837f1bf2f80559762.jpg",
  },
  {
    id: 4,
    name: "Tiramisu",
    image: "https://i.pinimg.com/736x/eb/67/cd/eb67cdd4329512df261dcde1dce229f9.jpg",
  },
]);
function goToRecipeDetail(recipeId: number) {
  router.push(`/recipes/${recipeId}`);
}

</script>

<template>
<div class="recipe-list">
  <h1 class="title">{{title}}</h1>
  <div v-if="recipes.length === 0" class="warning">No recipes found!</div>
  <div class="recipes-container">
    <div
      v-for="recipe in recipes"
         :key="recipe.id"
         class="recipe-card"
         @click="goToRecipeDetail(recipe.id)">
      <img :src="recipe.image" alt="Recipe image" class="recipe-image" />
      <h2 class="recipe-name">{{ recipe.name }}</h2>
    </div>
  </div>
</div>
</template>

<style scoped>
.recipe-list {
  text-align: center;
  font-family: 'Arial', sans-serif;
}
.title {
  margin: 20px 0;
  font-size: 2.5rem;
}
.recipes-container{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}
.recipe-card {
  width: 300px;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}
.recipe-card:hover {
  transform: scale(1.05);
}
.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.recipe-name {
  font-size: 1.2rem;
  margin: 10px 0;
}
.warning {
  color: red;
}
</style>

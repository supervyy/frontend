<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ title: string }>()
const recipes = ref([
  {
    id: 1,
    name: "Korean Fried Chicken",
    description: "Crispy and flavorful chicken with a spicy glaze.",
    instructions: "",
    image: "https://i.pinimg.com/736x/7f/4e/54/7f4e542859a08ac78396d4d63ccd7a10.jpg/300x200",
    category: "Appetizers",
    author: "Noobanh",
  },
  {
    id: 2,
    name: "Spaghetti Carbonara",
    description: "Classic Italian pasta with creamy sauce.",
    instructions: "",
    image: "https://i.pinimg.com/736x/fe/07/27/fe072747470c09eeadfcac3f450a130e.jpg/300x200",
    category: "Main Course",
    author: "Chef Luigi",
  },
  {
    id: 3,
    name: "Matcha Latte",
    description: "Refreshing green tea latte with a creamy texture.",
    instructions: "",
    image: "https://i.pinimg.com/736x/2d/37/32/2d3732b6026cd03893833607968e6c84.jpg/300x200",
    category: "Drinks",
    author: "Tea Lover",
  },
]);
const inputData = ref({ name: '', description: '', ingredients: '' });
</script>


<template>
<div class="recipe-list">
  <h1 class="title">{{title}}</h1>
  <div v-if="recipes.length === 0" class="warning">No recipes found!</div>
  <div v-else>
    <ul class="recipe-items">
      <li v-for="recipe in recipes" :key="recipe.id" class="recipe-card">
        <img :src="recipe.image" alt="Recipe image" class="recipe-image" />
        <h2>{{ recipe.name }}</h2>
        <p>{{ recipe.description }}</p>
        <p><strong>Ingredients:</strong> {{ recipe.ingredients }}</p>
      </li>
    </ul>
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
.recipe-items {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}
.recipe-card {
  width: 300px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.warning {
  color: red;
}

</style>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

defineProps<{ title: string }>()

interface Recipe {
  id: number
  name: string
  recipeImage: string
}
const recipes = ref<Recipe[]>([])
const router = useRouter()

const apiEndpoint = `${import.meta.env.VITE_APP_BACKEND_BASE_URL}/recipes`

function requestRecipes(): void {
  axios
    .get<Recipe[]>(apiEndpoint)
    .then((res) => {
      console.log(res.data)
      recipes.value = res.data
    })
    .catch((error) => {
      logError(error)
    })
}

function logError(err: unknown): void {
    alert('Something went wrong ... check your browser console for more information')
    console.error(err)
}
function goToRecipeDetail(recipeId: number) {
  router.push(`/recipes/${recipeId}`)
}
onMounted(() => {
  requestRecipes()
})
</script>

<template>
  <div class="recipe-list">
    <h1 class="title">{{ title }}</h1>
    <div v-if="recipes.length === 0" class="warning">No recipes found!</div>
    <div class="recipes-container">
      <div
        v-for="recipe in recipes"
        :key="recipe.id"
        class="recipe-card"
        @click="goToRecipeDetail(recipe.id)"
      >
      <img :src="recipe.recipeImage" alt="Recipe image" class="recipe-image" />
        <h2 class="recipe-name">{{ recipe.name }}</h2>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recipe-list {
  display: flex;
  flex-direction: column;
  text-align: center;
  font-family: 'Arial', sans-serif;
  margin-top: 3rem;
}
.title {
  font-family: 'Poppins', sans-serif;
  font-size: 1.8rem;
  font-weight: 600;
  text-align: center;
  margin: 5rem 0 0 0;
}
.recipes-container {
  display: flex;
  margin-top: 2rem;
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

@media screen and (min-width: 576px) {
  .recipe-list {
    grid-template-columns: 1fr 1fr;
  }
  .recipe-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
}

.recipe-name {
  font-family: 'Arial Nova', sans-serif;
  font-size: 1.1rem;
  margin: 10px 0;
}
.warning {
  color: red;
}
</style>

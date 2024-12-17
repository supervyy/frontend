<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

interface Recipe {
  id: number
  name: string
  description: string
  image: string
  category: string
  ingredients: string
  instructions: string
  author: string
}

const route = useRoute()
const recipe = ref<Recipe | null>(null)
const error = ref<string | null>(null)
const baseURL = import.meta.env.VITE_APP_BACKEND_BASE_URL
const apiEndpoint = baseURL+'/recipes'

function fetchRecipe(id: number): void {
  const url = `${apiEndpoint}/${id}`
  console.log('Requesting URL:', url) // Debugging log
  axios
    .get<Recipe>(url)
    .then((res) => {
      console.log('Fetched recipe data:', res.data) // Debugging log
      recipe.value = res.data
      error.value = null
    })
    .catch((error) => {
      if (error.response && error.response.status === 404) {
        error.value = 'Recipe not found'
      } else {
        logError(error)
      }
    })
}

function logError(err: unknown): void {
  alert('Something went wrong ... check your browser console for more information')
  console.error(err)
}

onMounted(() => {
  const id = parseInt(route.params.id as string, 10)
  console.log('Route parameter ID:', id) // Debugging log
  fetchRecipe(id)
})
</script>

<template>
  <div class="recipe-detail">
    <div v-if="recipe" class="detail-container">
      <h1 class="recipe-title">{{ recipe.name }}</h1>
      <img :src="recipe.image" alt="Recipe image" class="recipe-image" />
      <p class="recipe-description">{{ recipe.description }}</p>
      <p class="recipe-category"><strong>Category:</strong> {{ recipe.category }}</p>
      <p class="recipe-ingredients"><strong>Ingredients:</strong> {{ recipe.ingredients }}</p>
      <p class="recipe-instructions"><strong>Instructions:</strong> {{ recipe.instructions }}</p>
      <p class="recipe-author"><strong>Author:</strong> {{ recipe.author }}</p>
    </div>
    <div v-else-if="error" class="error-page">
      <h2>{{ error }}</h2>
    </div>
    <div v-else class="error-page">
      <h2>Loading...</h2>
    </div>
  </div>
</template>

<style scoped>
.recipe-detail {
  padding: 20px;
}
.detail-container {
  text-align: center;
}
.recipe-title {
  font-size: 2em;
  margin-bottom: 10px;
}
.recipe-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
}
.recipe-description {
  font-size: 1.2em;
}
.error-page {
  color: red;
  text-align: center;
  padding: 20px;
}
.recipe-category,
.recipe-ingredients,
.recipe-instructions,
.recipe-author {
  font-size: 1.1em;
  margin-top: 10px;
}
</style>

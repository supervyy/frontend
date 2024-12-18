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
  <div class="recipe-detail-container">
    <div class="recipe-detail">
      <div class="left-section">
        <div class="recipe-image-container">
          <img v-if="recipe" :src="recipe.image" alt="Rezeptbild" class="recipe-image" />
        </div>
      </div>
      <div class="right-section">
        <h1 class="recipe-title" v-if="recipe">{{ recipe.name }}</h1>
        <div class="recipe-info">
          <p class="recipe-description" v-if="recipe">{{ recipe.description }}</p>
          <div class="recipe-meta" v-if="recipe">
            <p class="recipe-category"><strong>Kategorie:</strong> {{ recipe.category }}</p>
          </div>
          <div class="recipe-details" v-if="recipe">
            <p class="recipe-ingredients"><strong>Zutaten:</strong> {{ recipe.ingredients }}</p>
            <p class="recipe-instructions"><strong>Zubereitung:</strong> {{ recipe.instructions }}</p>
            <p class="recipe-author"><strong>Autor:</strong> {{ recipe.author }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recipe-detail-container {
  display: flex;
  flex-direction: column;
  margin-top: 100px;
  width: 100%;
}

.recipe-title {
  font-family: 'Poppins', sans-serif;
  font-size: 3rem;
  font-weight: 600;
  text-align: center;
  margin-top: 2rem;
  margin-right: 5rem;
}

.recipe-detail {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 2rem;
  gap: 4rem;
}

.left-section {
  flex: 0 0 35%;
  margin-left: 8rem;
}

.recipe-image-container {
  width: 100%;
}

.recipe-image {
  width: 500px; /* Verdoppelt von 400px auf 800px */
  height: 300px; /* Verdoppelt von 300px auf 600px */
  object-fit: cover;
  border-radius: 8px;

  transform: translate(-30%, 65%);
}

.right-section {
  flex: 0 0 45%;
  margin-top: 5rem;
  margin-right: 30rem;
}

.recipe-info {
  text-align: left;
  font-size: 100%; /* Reduziert von 200% */
}

.recipe-description {
  margin-bottom: 2rem; /* Reduziert von 3rem */
  font-size: 1.25rem; /* Reduziert von 1.8rem */
}

.recipe-meta {
  margin-bottom: 2rem; /* Reduziert von 3rem */
  font-size: 1.25rem; /* Reduziert von 1.8rem */
}

.recipe-details {
  font-size: 1.25rem; /* Reduziert von 1.8rem */
}

.recipe-ingredients,
.recipe-instructions,
.recipe-author {
  margin-bottom: 0.75rem; /* Reduziert von 1rem */
  font-size: 1.25rem; /* Reduziert von 1.8rem */
}
</style>

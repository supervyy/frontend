<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

interface Recipe {
  id: number
  name: string
  image: string
  category: string
  favorite: boolean
}

const recipes = ref<Recipe[]>([])
const router = useRouter()
const baseURL = import.meta.env.VITE_APP_BACKEND_BASE_URL
const apiEndpoint = baseURL + '/recipes'

function requestFavoriteRecipes(): void {
  axios
    .get<Recipe[]>(apiEndpoint)
    .then((res) => {
      console.log('Fetched recipes:', res.data)
      recipes.value = res.data.filter((recipe) => recipe.favorite)
      console.log('Filtered favorite recipes:', recipes.value)
    })
    .catch((error) => {
      console.error('Error fetching favorite recipes:', error)
    })
}

function goToRecipeDetail(recipeId: number) {
  router.push(`/recipes/${recipeId}`)
}

onMounted(() => {
  requestFavoriteRecipes()
})
</script>

<template>
  <h1 class="title">Favorites</h1>
  <div class="recipe-list">
    <div v-if="recipes.length === 0" class="warning">No favorite recipes found!</div>
    <div class="recipes-container">
      <div
        v-for="recipe in recipes"
        :key="recipe.id"
        class="recipe-card"
        @click="goToRecipeDetail(recipe.id)"
      >
        <img :src="recipe.image" alt="Recipe image" class="recipe-image" />
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
  margin-top: 5rem; /* increased from 3rem to 5rem */
}
.title {
  font-family: 'Poppins', sans-serif;
  font-size: 1.8rem;
  font-weight: 600;
  display: block; /* changed from flex to block */
  text-align: center; /* center the text */
  margin: 10rem 0 20rem 34rem; /* shifted title to the right */
  /* removed margin-left: 34rem */
}
.recipes-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-width: 1000px; /* reduced from 1200px */
  margin: 10rem 0 0 -40rem; /* changed to negative margin to move far left */
}
.recipe-card {
  width: 280px;
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
    grid-template-columns: repeat(4, 1fr);
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

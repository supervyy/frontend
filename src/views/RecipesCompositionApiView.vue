<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import { onMounted } from 'vue'

interface Recipe {
  id: number
  name: string
  image: string
  category: string
  favorite: boolean
}
const recipes = ref<Recipe[]>([])
const router = useRouter()
const route = useRoute()
const baseURL = import.meta.env.VITE_APP_BACKEND_BASE_URL
const apiEndpoint = baseURL + '/recipes'
const categoryFilter = ref<string | null>(null)

const displayTitle = computed(() => (categoryFilter.value ? categoryFilter.value : 'Recipes'))

const searchTerm = ref('')

const filteredRecipes = computed(() => {
  if (!searchTerm.value.trim()) return recipes.value
  return recipes.value.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.value.trim().toLowerCase())
  )
})

function onSearch() {
  console.log('Searching for:', searchTerm.value)
}

function requestRecipes(): void {
  console.log('Requesting all recipes from:', apiEndpoint)
  axios
    .get<Recipe[]>(apiEndpoint)
    .then((res) => {
      const allRecipes = res.data
      console.log('Fetched recipes:', allRecipes)

      if (categoryFilter.value) {
        console.log(`Filtering recipes by category: ${categoryFilter.value}`)
        recipes.value = allRecipes.filter(
          (recipe) => recipe.category.toLowerCase() === categoryFilter.value!.toLowerCase(),
        )
      } else {
        recipes.value = allRecipes
      }
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
  console.log('Navigating to recipe detail with ID:', recipeId)
  router.push(`/recipes/${recipeId}`)
}

onMounted(() => {
  if (route?.params.category) {
    categoryFilter.value = String(route?.params.category)
  }
  requestRecipes()
})

watch(
  () => route?.params.category,
  (newCategory) => {
    categoryFilter.value = newCategory ? String(newCategory) : null
    console.log(`Route category changed to: ${categoryFilter.value}`)
    requestRecipes()
  },
)

function toggleFavorite(recipeId: number): void {
  console.log('toggleFavorite called with id:', recipeId)
  const recipe = recipes.value.find((r) => r.id === recipeId)
  if (recipe) {
    const newFavoriteStatus = !recipe.favorite

    axios
      .put(`${baseURL}/recipes/${recipeId}`, {
        ...recipe,
        favorite: newFavoriteStatus,
      })
      .then(() => {
        recipe.favorite = newFavoriteStatus
        console.log('New favorite status:', recipe.favorite)
      })
      .catch((error) => {
        console.error('Error updating favorite status:', error)
      })
  }
}
</script>

<template>
  <h1 class="title">{{ displayTitle }}</h1>
  <input
    class="search-bar"
    type="text"
    v-model="searchTerm"
    @input="onSearch"
    placeholder="Search..."
  />
  <div class="recipe-list">
    <div v-if="recipes.length === 0" class="warning">No recipes found!</div>
    <div class="recipes-container">
      <div
        v-for="recipe in filteredRecipes"
        :key="recipe.id"
        class="recipe-card"
        @click="goToRecipeDetail(recipe.id)"
      >
        <!-- Rezeptbild -->
        <img :src="recipe.image" alt="Recipe image" class="recipe-image" />
        <!-- Rezeptname -->
        <h2 class="recipe-name">{{ recipe.name }}</h2>
        <!-- Herz-Symbol -->
        <button class="btn" @click.stop="toggleFavorite(recipe.id)">
          <svg
            :class="['icon', { 'icon-filled': recipe.favorite }]"
            xmlns="http://www.w3.org/2000/svg"
            width="20.503"
            height="20.625"
            viewBox="0 0 17.503 15.625"
          >
            <path
              id="Fill"
              d="M8.752,15.625h0L1.383,8.162a4.824,4.824,0,0,1,0-6.762,4.679,4.679,0,0,1,6.674,0l.694.7.694-.7a4.678,4.678,0,0,1,6.675,0,4.825,4.825,0,0,1,0,6.762L8.752,15.624ZM4.72,1.25A3.442,3.442,0,0,0,2.277,2.275a3.562,3.562,0,0,0,0,5l6.475,6.556,6.475-6.556a3.563,3.563,0,0,0,0-5A3.443,3.443,0,0,0,12.786,1.25h-.01a3.415,3.415,0,0,0-2.443,1.038L8.752,3.9,7.164,2.275A3.442,3.442,0,0,0,4.72,1.25Z"
              transform="translate(0 0)"
            ></path>
          </svg>
        </button>
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
  margin-top: 5rem;
}
.title {
  font-family: 'Poppins', sans-serif;
  font-size: 1.8rem;
  font-weight: 600;
  display: block;
  text-align: center;
  margin: 7rem 0 20rem 34rem;
}
.recipes-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-width: 1000px;
  margin: 7rem 0 0 -40rem;
}
.recipe-card {
  width: 280px;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  position: relative;
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

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 10px;
  cursor: pointer;
  border: none;
  background-color: transparent;
  bottom: -1px;
  right: -1px;
  position: absolute;
}

.btn::after {
  content: 'like';
  width: fit-content;
  height: fit-content;
  position: absolute;
  font-size: 15px;
  color: red;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva,
    Verdana, sans-serif;
  opacity: 0;
  visibility: hidden;
  transition: 0.2s linear;
  top: 115%;
}

.icon {
  width: 25px;
  height: 25px;
  transition: 0.2s linear;
}
.icon-filled path {
  fill: red !important; /* Erzwingt die rote Farbe */
}

.icon path {
  fill: #ddd; /* Standardfarbe für nicht ausgewählte Herzen */
  transition: fill 0.2s linear;
}

.btn:hover > .icon path {
  fill: rgb(231, 135, 109); /* Farbe bei Hover */
}

.btn:hover > .icon path {
  fill: rgb(231, 135, 109);
}

.btn:hover::after {
  visibility: visible;
  opacity: 1;
  top: 105%;
}

.search-bar {
  position: absolute;
  top: 7.5rem; /* Adjust if needed */
  right: 5rem; /* Adjust if needed */
  width: 200px;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 2px solid #ccc;
}
</style>

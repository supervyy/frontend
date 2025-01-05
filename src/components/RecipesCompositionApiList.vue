<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import { onMounted } from 'vue'


interface Recipe {
  id: number
  name: string
  image: string
  category: string // Added category property
}
const recipes = ref<Recipe[]>([])
const router = useRouter()
const route = useRoute()
const baseURL = import.meta.env.VITE_APP_BACKEND_BASE_URL
const apiEndpoint = baseURL+'/recipes'
const categoryFilter = ref<string | null>(null)

const displayTitle = computed(() =>
  categoryFilter.value ? categoryFilter.value : 'Recipes'
)

function requestRecipes(): void {
  console.log('Requesting all recipes from:', apiEndpoint)
  axios
    .get<Recipe[]>(apiEndpoint)
    .then((res) => {
      const allRecipes = res.data
      console.log('Fetched recipes:', allRecipes)

      // Filter recipes by category if categoryFilter is set
      if (categoryFilter.value) {
        console.log(`Filtering recipes by category: ${categoryFilter.value}`)
        recipes.value = allRecipes.filter(recipe =>
          recipe.category.toLowerCase() === categoryFilter.value!.toLowerCase()
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
  if (route.params.category) {
    categoryFilter.value = String(route.params.category)
  }
  requestRecipes()
})

// Watch for changes in the route's category parameter
watch(
  () => route.params.category,
  (newCategory) => {
    categoryFilter.value = newCategory ? String(newCategory) : null
    console.log(`Route category changed to: ${categoryFilter.value}`)
    requestRecipes()
  }
)

const isLiked = ref(false);
function toggleLike() {
  isLiked.value = !isLiked.value;
}
</script>

<template>
  <h1 class="title">{{ displayTitle }}</h1>
  <div class="recipe-list">
    <div v-if="recipes.length === 0" class="warning">No recipes found!</div>
    <div class="recipes-container">
      <div
        v-for="recipe in recipes"
        :key="recipe.id"
        class="recipe-card"
        @click="goToRecipeDetail(recipe.id)"
      >
      <!-- Rezeptbild -->
      <img :src="recipe.image" alt="Recipe image" class="recipe-image" />
       <!-- Rezeptname -->
      <h2 class="recipe-name">{{ recipe.name }}</h2>
       <!-- Herz-Symbol -->
      <div class="heart-container" @click.stop="toggleLike"> <!-- .stop hinzugefügt -->
        <div :class="['heart', { liked: isLiked }]"></div>
      </div>

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
  margin-top: 7rem; /* increased from 3rem to 5rem */
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
  max-width: 1000px; /* reduced from 1200px */
  margin: 5rem 0 0 -40rem; /* changed to negative margin to move far left */
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

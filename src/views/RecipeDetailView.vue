<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import DeleteConfirmation from '@/components/DeleteConfirmation.vue'

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
const router = useRouter()
const recipe = ref<Recipe | null>(null)
const error = ref<string | null>(null)
const baseURL = import.meta.env.VITE_APP_BACKEND_BASE_URL
const apiEndpoint = baseURL + '/recipes'

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

const formattedInstructions = computed(() => {
  if (!recipe.value?.instructions) return []
  return recipe.value.instructions
    .split(/(\d+\.)/) // Split on numbers followed by dot
    .filter((text) => text.trim()) // Remove empty strings
    .map((text, index, array) => {
      if (text.match(/^\d+\.$/)) {
        // If it's a number, create a step number
        const stepNum = text.replace('.', '')
        return { stepNum, text: array[index + 1]?.trim() || '' }
      }
      // Skip the text pieces that were already combined
      return array[index - 1]?.match(/^\d+\.$/) ? null : { stepNum: '', text: text.trim() }
    })
    .filter((item) => item && item.stepNum) // Keep only valid step items
})

// Add new computed property for ingredients formatting
const formattedIngredients = computed(() => {
  if (!recipe.value?.ingredients) return []
  return recipe.value.ingredients
    .split(',')
    .filter((ingredient) => ingredient.trim())
    .map((ingredient) => ingredient.trim())
})
const showDelete = ref(false)

function handleDelete() {
  showDelete.value = true
}
async function confirmDelete() {
  if (recipe.value) {
    try {
      await axios.delete(`${baseURL}/recipes/${recipe.value.id}`)
      showDelete.value = false
      router.push('/recipes')
    } catch (error) {
      console.error('Error deleting recipe:', error)
    }
  }
}

function goToEditPage() {
  if (recipe.value) {
    router.push(`/recipes/${recipe.value.id}/edit`)
  }
}
</script>

<template>
  <div class="recipe-detail-container">
    <!-- Top Section -->
    <section class="top-section">
      <!-- Left Side - Image -->
      <div class="image-side">
        <div class="recipe-image-container">
          <img v-if="recipe" :src="recipe.image" alt="Recipe Image" class="recipe-image" />
        </div>
        <div class="button-container">
          <button class="button" @click="goToEditPage">
            <svg
              class="svg-icon"
              fill="none"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g stroke="#0a050c" stroke-linecap="round" stroke-width="2">
                <path d="m20 20h-16"></path>
                <path
                  clip-rule="evenodd"
                  d="m14.5858 4.41422c.781-.78105 2.0474-.78105 2.8284 0 .7811.78105.7811 2.04738 0 2.82843l-8.28322 8.28325-3.03046.202.20203-3.0304z"
                  fill-rule="evenodd"
                ></path>
              </g>
            </svg>
            <span class="lable">Edit</span>
          </button>
          <button class="btn" @click.stop="handleDelete">
            <svg
              viewBox="0 0 15 17.5"
              height="17.5"
              width="15"
              xmlns="http://www.w3.org/2000/svg"
              class="icon"
            >
              <path
                transform="translate(-2.5 -1.25)"
                d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z"
                id="Fill"
              ></path>
            </svg>
          </button>
        </div>
        <DeleteConfirmation
          :show="showDelete"
          @confirm="confirmDelete"
          @cancel="showDelete = false"
        />
      </div>

      <!-- Right Side - Details -->
      <div class="details-side">
        <h1 class="recipe-title" v-if="recipe">{{ recipe.name }}</h1>
        <p class="recipe-description" v-if="recipe">{{ recipe.description }}</p>
        <div class="meta-info">
          <p class="recipe-category" v-if="recipe">
            <strong>Category:</strong> {{ recipe.category }}
          </p>
          <p class="recipe-author" v-if="recipe"><strong>Author:</strong> {{ recipe.author }}</p>
        </div>
      </div>
    </section>

    <!-- Bottom Section -->
    <section class="bottom-section">
      <div class="bottom-content">
        <div class="instructions-section">
          <h2>Instructions</h2>
          <div v-if="recipe" class="instructions-list">
            <div
              v-for="(step, index) in formattedInstructions"
              :key="index"
              class="instruction-step"
            >
              <h3 v-if="step" class="step-header">Step {{ step.stepNum }}</h3>
              <p v-if="step" class="step-text">{{ step.text }}</p>
            </div>
          </div>
        </div>
        <div class="ingredients-section">
          <h2>Ingredients</h2>
          <div v-if="recipe" class="ingredients-list">
            <p
              v-for="(ingredient, index) in formattedIngredients"
              :key="index"
              class="ingredient-item"
            >
              {{ ingredient }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.recipe-detail-container {
  display: flex;
  flex-direction: column;
  margin-top: 100px;
  width: 100%;
}

.top-section {
  display: flex;
  justify-content: space-between;
  padding: 2rem;
  gap: 4rem;
  margin-bottom: 2rem;
}

.image-side {
  flex: 0 0 35%;
  margin-left: 15rem; /* Increased from 12rem to 15rem */
}

.recipe-image-container {
  width: 100%;
}

.recipe-image {
  width: 450px; /* Reduced from 500px */
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  transform: translate(-35%, 20%); /* Changed from -30% to -35% to move left */
}

.details-side {
  flex: 0 0 45%;
  margin-right: 8rem; /* Reduced from 10rem */
  padding-top: 4rem; /* Changed from 2rem to 4rem to move content down */
  margin-left: -9rem; /* Changed from -6rem to -9rem to move text left */
}

.recipe-title {
  font-family: 'Poppins', sans-serif;
  font-size: 2rem; /* Reduced from 2.5rem */
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.recipe-description {
  font-family: 'Poppins', sans-serif;
  font-size: 1.1rem; /* Reduced from 1.25rem */
  margin-bottom: 2rem;
  line-height: 1.6;
}

.meta-info {
  display: flex;
  gap: 2rem;
  font-size: 1rem; /* Reduced from 1.1rem */
  font-family: 'Poppins', sans-serif;
}

.meta-info strong {
  font-weight: 700; /* Increased from default 600 */
}

.bottom-section {
  width: 90%;
  margin: 2rem auto 4rem auto; /* Reduced top margin from 4rem to 2rem */
}

.bottom-content {
  display: flex;
  gap: 4rem;
  justify-content: space-between;
}

.instructions-section {
  flex: 0 0 60%; /* Reduced from 70% */
}

.ingredients-section {
  flex: 0 0 35%; /* Increased from 25% */
}

.ingredients-list {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Increased from 0.75rem for more spacing */
}

.ingredient-item {
  font-family: 'Poppins', sans-serif;
  font-size: 1.2rem; /* Increased from 1.1rem */
  line-height: 1.8;
  padding: 0.75rem 1rem; /* Added more padding */
  border-bottom: 1px solid #e0e0e0;
  display: block; /* Ensures each ingredient is on its own line */
  white-space: nowrap; /* Prevent text wrapping */
  overflow: hidden;
  text-overflow: ellipsis; /* Add dots for overflow text */
}

.ingredient-item:last-child {
  border-bottom: none;
}

.instructions-section {
  margin-bottom: 5rem;
}
.ingredients-section {
  margin-left: 5rem; /* Add margin to move ingredients right */
  padding-right: 1rem;
}

.ingredients-section h2,
.instructions-section h2 {
  font-family: 'Poppins', sans-serif;
  font-size: 2rem; /* Reduced from 2.5rem to match recipe-title */
  font-weight: 600;
  margin-bottom: 1.5rem;
  /* Removed border-bottom, padding-bottom, and display properties */
}

.ingredients-section p,
.instructions-section p,
.instruction-step {
  font-family: 'Poppins', sans-serif;
  font-size: 1.1rem; /* Reduced from 1.25rem */
  line-height: 1.8;
}

.instructions-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* Reduced from 1rem */
}

.instruction-step {
  padding: 0.25rem 0; /* Reduced from 0.5rem */
}

.step-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-family: 'Poppins', sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.25rem; /* Reduced margin */
}

.step-header::after {
  content: '';
  flex-grow: 1;
  height: 1px;
  background-color: #e0e0e0;
}

.step-text {
  font-family: 'Poppins', sans-serif;
  font-size: 1.1rem;
  line-height: 1.8;
  padding-left: 0.25rem; /* Reduced from 0.5rem */
  margin-bottom: 0.5rem; /* Reduced margin */
}

.instruction-step:last-child {
  border-bottom: none;
}

.button-container {
  display: flex;
  gap: 1rem;
  margin-top: 5rem; /* Increased from 3rem to 5rem */
  width: 450px; /* Match image width */
  padding-right: 0; /* Remove padding */
  justify-content: flex-end; /* Align buttons to right */
  transform: translateX(-35%); /* Match image transform */
}

.edit-btn,
.edit-btn:hover,
.btn {
  background-color: transparent;
  position: relative;
  border: none;
}

.btn::after {
  content: 'delete';
  position: absolute;
  top: -1%;
  left: 50%;
  transform: translateX(-50%);
  width: fit-content;
  height: fit-content;
  background-color: rgb(168, 7, 7);
  padding: 4px 8px;
  border-radius: 5px;
  transition: 0.2s linear;
  transition-delay: 0.2s;
  color: white;
  text-transform: uppercase;
  font-size: 12px;
  opacity: 0;
  visibility: hidden;
}

.icon {
  transform: scale(1.2);
  transition: 0.2s linear;
}

.btn:hover > .icon {
  transform: scale(1.5);
}

.btn:hover > .icon path {
  fill: rgb(168, 7, 7);
}

.btn:hover::after {
  visibility: visible;
  opacity: 1;
  top: -55%;
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 12px;
  gap: 2px;
  height: 40px;
  width: 85px;
  border: none;
  background: #adaaae3d;
  border-radius: 20px;
  cursor: pointer;
}

.lable {
  line-height: 15px;
  font-size: 15px;
  color: #0a050c;
  font-family: sans-serif;
  letter-spacing: 1px;
}

.button:hover {
  background: antiquewhite;
}

.button:hover .svg-icon {
  animation: lr 1s linear infinite;
}

@keyframes lr {
  0% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-1px);
  }

  75% {
    transform: translateX(1px);
  }

  100% {
    transform: translateX(0);
  }
}
</style>

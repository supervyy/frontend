<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const baseURL = import.meta.env.VITE_APP_BACKEND_BASE_URL

const recipe = ref({
  name: '',
  description: '',
  image: '',
  category: '',
  ingredients: '',
  instructions: '',
  author: '',
  favorite: false
})

const categories = [
  'Appetizers',
  'Breakfast',
  'Main Course',
  'Dessert',
  'Drinks',
  'Vegetarian'
]

const error = ref<string | null>(null)

async function submitRecipe() {
  try {
    const response = await axios.post(`${baseURL}/recipes`, recipe.value)
    console.log('Recipe created:', response.data)
    router.push('/recipes-composition-api')
  } catch (err) {
    error.value = 'Failed to create recipe'
    console.error('Error creating recipe:', err)
  }
}
</script>

<template>
  <div class="create-recipe">
    <h1>Create new Recipe</h1>
    <form @submit.prevent="submitRecipe" class="recipe-form">
      <div class="form-group">
        <label for="name">Recipe Name:</label>
        <input id="name" v-model="recipe.name" type="text" required />
      </div>

      <div class="form-group">
        <label for="description">Description:</label>
        <textarea id="description" v-model="recipe.description" required></textarea>
      </div>

      <div class="form-group">
        <label for="image">Image URL:</label>
        <input id="image" v-model="recipe.image" type="url" required />
      </div>

      <div class="form-group">
        <label for="category">Category:</label>
        <select id="category" v-model="recipe.category" required>
          <option value="" disabled>Select a category</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="ingredients">Ingredients (comma separated):</label>
        <textarea id="ingredients" v-model="recipe.ingredients" required></textarea>
      </div>

      <div class="form-group">
        <label for="instructions">Instructions (numbered steps):</label>
        <textarea id="instructions" v-model="recipe.instructions" required></textarea>
      </div>

      <div class="form-group">
        <label for="author">Author:</label>
        <input id="author" v-model="recipe.author" type="text" required />
      </div>

      <div class="form-group checkbox-group">
        <label class="checkbox-label">
          <input type="checkbox" v-model="recipe.favorite">
          Add to Favorites
        </label>
      </div>

      <div class="error" v-if="error">{{ error }}</div>

      <button type="submit" class="submit-btn">Create Recipe</button>
    </form>
  </div>
</template>

<style scoped>
.create-recipe {
  max-width: 800px;
  margin: 8rem auto;
  margin-left: 17.5rem; /* Added to shift content right */
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

.recipe-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 600;
}

input, select, textarea {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: inherit;
  font-size: 1rem;
  width: 100%; /* Controls the width of all input fields */
  max-width: 600px; /* Maximum width for the fields */
}

textarea {
  min-height: 300px;
  resize: vertical;
  width: 600px; /* Specific width for textareas */
}

.submit-btn {
  background-color: antiquewhite;
  color: #333;
  padding: 1rem 2rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.submit-btn:hover {
  background-color: #ffe4c4;
}

.error {
  color: red;
  margin-top: 1rem;
  text-align: center;
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}
</style>

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
  favorite: false,
})

const categories = ['Appetizers', 'Breakfast', 'Main Course', 'Dessert', 'Drinks', 'Vegetarian']

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
          <input type="checkbox" v-model="recipe.favorite" />
          Add to Favorites
        </label>
      </div>

      <div class="error" v-if="error">{{ error }}</div>

      <button type="submit" class="submit-btn">Create</button>
    </form>
  </div>
</template>

<style scoped>
.create-recipe {
  max-width: 800px;
  margin: 8rem auto;
  margin-left: 17.5rem;
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

input,
select,
textarea {
  padding: 0.8rem;
  border: 2px solid transparent;
  border-radius: 6px;
  font-family: inherit;
  font-size: 1rem;
  width: 100%;
  max-width: 600px;
  outline: none;
  overflow: hidden;
  background-color: #f3f3f3;
  border-radius: 10px;
  transition: all 0.5s;
}
input:hover,
input:focus,
select:hover,
select:focus,
textarea:hover,
textarea:focus {
  border: 2px solid antiquewhite;
  box-shadow: 0px 0px 0px 7px rgba(237, 171, 230, 0.2);
  background-color: white;
}
select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: #f3f3f3;
  border: 2px solid transparent;
  color: #333;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
}

select:hover,
select:focus {
  border: 2px solid antiquewhite;
  box-shadow: 0px 0px 0px 7px rgba(237, 171, 230, 0.2);
  background-color: white;
  color: #333;
}

select option {
  background-color: #f3f3f3; /* Default background color for options */
  color: #333; /* Text color */
}

select option:hover,
select option:focus,
select option:active,
select option:checked {
  background-color: antiquewhite !important;
  color: #333 !important;
  border: 2px solid antiquewhite;
}

textarea {
  min-height: 300px;
  resize: vertical;
  width: 600px;
}

.submit-btn {
  background-color: #f3f3f3;
  color: #333;
  padding: 1rem 2rem;
  cursor: pointer;
  transition: all 0.5s;
  border: 2px solid transparent;
  border-radius: 10px;
  font-family: 'Poppins', sans-serif;
  font-size: 1.2rem;
}

.submit-btn:hover {
  border: 2px solid antiquewhite;
  box-shadow: 0px 0px 0px 7px rgba(237, 171, 230, 0.2);
  background-color: antiquewhite;
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
  accent-color: antiquewhite;
}

.checkbox-label input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  background-color: antiquewhite;
}
</style>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const baseURL = import.meta.env.VITE_APP_BACKEND_BASE_URL

const recipe = ref({
  name: '',
  description: '',
  image: '',
  category: '',
  ingredients: [] as string[],
  instructions: '',
  author: '',
  favorite: false,
})

const newIngredient = ref('')

const addIngredient = () => {
  if (newIngredient.value.trim()) {
    recipe.value.ingredients.push(newIngredient.value.trim())
    newIngredient.value = ''
  }
}

const removeIngredient = (index: number) => {
  recipe.value.ingredients.splice(index, 1)
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    addIngredient()
  }
}

const categories = ['Appetizers', 'Breakfast', 'Main Course', 'Dessert', 'Drinks', 'Vegetarian']

const error = ref<string | null>(null)

const isFieldValid = (value: string) => value.trim().length > 0
const isUrlValid = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const validations = computed(() => ({
  name: isFieldValid(recipe.value.name),
  description: isFieldValid(recipe.value.description),
  image: isUrlValid(recipe.value.image),
  category: isFieldValid(recipe.value.category),
  ingredients: recipe.value.ingredients.length > 0,
  instructions: isFieldValid(recipe.value.instructions),
  author: isFieldValid(recipe.value.author)
}))

async function submitRecipe() {
  try {
    const recipeData = {
      ...recipe.value,
      ingredients: recipe.value.ingredients.join(', ') // Join array to string for backend
    }
    const response = await axios.post(`${baseURL}/recipes`, recipeData)
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
        <input id="name" v-model="recipe.name" type="text" required
               :class="{ 'valid': validations.name }" />
      </div>

      <div class="form-group">
        <label for="description">Description:</label>
        <textarea id="description" v-model="recipe.description" required
                  :class="{ 'valid': validations.description }"></textarea>
      </div>

      <div class="form-group">
        <label for="image">Image URL:</label>
        <input id="image" v-model="recipe.image" type="url" required
               :class="{ 'valid': validations.image }" />
      </div>

      <div class="form-group">
        <label for="category">Category:</label>
        <select id="category" v-model="recipe.category" required
                :class="{ 'valid': validations.category }">
          <option value="" disabled>Select a category</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="ingredients">Ingredients:</label>
        <div class="ingredients-container">
          <div class="ingredients-input-group">
            <input
              id="ingredients"
              v-model="newIngredient"
              type="text"
              placeholder="Type an ingredient and press Enter or Add"
              @keypress="handleKeyPress"
              :class="{ 'valid': validations.ingredients }"
            />
            <button type="button" @click="addIngredient" class="add-ingredient-btn">
              <span>+</span>
            </button>
          </div>
          <ul class="ingredients-list">
            <li v-for="(ingredient, index) in recipe.ingredients" :key="index" class="ingredient-item">
              <span class="ingredient-text">{{ ingredient }}</span>
              <button type="button" @click="removeIngredient(index)" class="remove-ingredient-btn">
                ×
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div class="form-group">
        <label for="instructions">Instructions (numbered steps):</label>
        <textarea id="instructions" v-model="recipe.instructions" required
                  :class="{ 'valid': validations.instructions }"></textarea>
      </div>

      <div class="form-group">
        <label for="author">Author:</label>
        <input id="author" v-model="recipe.author" type="text" required
               :class="{ 'valid': validations.author }" />
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
  background-color: #f3f3f3;
  color: #333;
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

input.valid,
select.valid,
textarea.valid {
  background-color: antiquewhite;
}

input.valid:hover,
select.valid:hover,
textarea.valid:hover,
input.valid:focus,
select.valid:focus,
textarea.valid:focus {
  background-color: antiquewhite;
  border: 2px solid antiquewhite;
  box-shadow: 0px 0px 0px 7px rgba(237, 171, 230, 0.2);
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

/* Add these new styles for ingredients */
.ingredients-container {
  background-color: antiquewhite;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.ingredients-input-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 1rem;
}

.ingredients-input-group input {
  flex: 1;
  font-size: 0.95rem;
  padding: 0.8rem 1rem;
  border: 2px solid #f0f0f0;
  transition: all 0.3s ease;
}

.add-ingredient-btn {
  min-width: 42px;
  height: 42px;
  padding: 0;
  border: none;
  background-color: antiquewhite;
  color: #666;
  border-radius: 21px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 300;
}

.add-ingredient-btn:hover {
  background-color: #f8d5b4;
  transform: scale(1.05);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.ingredients-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  /* removed max-height and overflow-y */
}

.ingredient-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background-color: antiquewhite;
  border-radius: 8px;
  transition: all 0.3s ease;
  width: 100%;
}

.ingredient-item:hover {
  background-color: #f8d5b4;
  transform: translateX(4px);
}

.ingredient-text {
  color: #444;
  flex-grow: 1;
}

.remove-ingredient-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: #ffeeee;
  color: #ff4444;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  border-radius: 6px;
  margin-left: 8px;
  transition: all 0.2s ease;
}

.remove-ingredient-btn:hover {
  background-color: #ff4444;
  color: white;
  transform: scale(1.1);
}
</style>

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
  instructions: [] as string[],
  author: '',
  favorite: false,
})

const newIngredient = ref('')
const newInstruction = ref('')

const addIngredient = () => {
  if (newIngredient.value.trim()) {
    recipe.value.ingredients.push(newIngredient.value.trim())
    newIngredient.value = ''
  }
}

const addInstruction = () => {
  if (newInstruction.value.trim()) {
    recipe.value.instructions.push(newInstruction.value.trim())
    newInstruction.value = ''
  }
}

const removeIngredient = (index: number) => {
  recipe.value.ingredients.splice(index, 1)
}

const removeInstruction = (index: number) => {
  recipe.value.instructions.splice(index, 1)
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    addIngredient()
  }
}

const handleInstructionKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    addInstruction()
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
  instructions: recipe.value.instructions.length > 0, // Update validation for instructions
  author: isFieldValid(recipe.value.author),
}))

async function submitRecipe() {
  try {
    const recipeData = {
      ...recipe.value,
      ingredients: recipe.value.ingredients.join(', '),
      instructions: recipe.value.instructions.join('. '),
    }
    const response = await axios.post(`${baseURL}/recipes`, recipeData)
    console.log('Recipe created:', response.data)
    router.push({ path: '/recipes-composition-api-list', query: { created: 'true' } }) // Navigate with success query
    error.value = null
  } catch (err) {
    error.value = 'Failed to create recipe'
    console.error('Error creating recipe:', err)
  }
}

const editingInstruction = ref<number | null>(null)
const editedInstructionText = ref('')

const startEditingInstruction = (index: number, text: string) => {
  editingInstruction.value = index
  editedInstructionText.value = text
}

const saveEditedInstruction = (index: number) => {
  if (editedInstructionText.value.trim()) {
    recipe.value.instructions[index] = editedInstructionText.value.trim()
  } else {
    recipe.value.instructions.splice(index, 1)
  }
  editingInstruction.value = null
  editedInstructionText.value = ''
}

const cancelEditingInstruction = () => {
  editingInstruction.value = null
  editedInstructionText.value = ''
}

const editingIngredient = ref<number | null>(null)
const editedIngredientText = ref('')

const startEditingIngredient = (index: number, text: string) => {
  editingIngredient.value = index
  editedIngredientText.value = text
}

const saveEditedIngredient = (index: number) => {
  const trimmedText = editedIngredientText.value.trim()
  if (trimmedText) {
    recipe.value.ingredients[index] = trimmedText
  } else {
    recipe.value.ingredients.splice(index, 1)
  }
  editingIngredient.value = null
  editedIngredientText.value = ''
}

const cancelEditingIngredient = () => {
  editingIngredient.value = null
  editedIngredientText.value = ''
}
</script>

<template>
  <div class="create-recipe">
    <h1>Create Recipe</h1>
    <form @submit.prevent="submitRecipe" class="recipe-form">
      <div class="form-group">
        <label for="name">Recipe Name *</label>
        <span class="helper-text">Enter a recipe name.</span>
        <input
          id="name"
          v-model="recipe.name"
          type="text"
          required
          :class="{ valid: validations.name }"
        />
      </div>

      <div class="form-group">
        <label for="description">Description *</label>
        <span class="helper-text">Enter a recipe description.</span>
        <textarea
          id="description"
          v-model="recipe.description"
          required
          :class="{ valid: validations.description }"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="image">Image URL *</label>
        <span class="helper-text">Enter the URL of your recipe image.</span>
        <input
          id="image"
          v-model="recipe.image"
          type="url"
          required
          :class="{ valid: validations.image }"
        />
      </div>

      <div class="form-group">
        <label for="category">Category *</label>
        <span class="helper-text">Select a recipe category.</span>
        <select
          id="category"
          v-model="recipe.category"
          required
          :class="{ valid: validations.category }"
        >
          <option value="" disabled>Select a category</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="ingredients">Ingredients *</label>
        <span class="helper-text"
          >Enter an ingredient and select the 'add ingredient' button.<br />
          Double-click or use the edit button to modify existing ingredients.</span
        >
        <div class="ingredients-container">
          <ul class="ingredients-list">
            <li
              v-for="(ingredient, index) in recipe.ingredients"
              :key="index"
              class="ingredient-item"
            >
              <template v-if="editingIngredient === index">
                <input
                  v-model="editedIngredientText"
                  type="text"
                  class="edit-ingredient-input"
                  @keyup.enter="saveEditedIngredient(index)"
                  @keyup.esc="cancelEditingIngredient"
                  ref="editInput"
                  v-focus
                />
                <div class="edit-buttons">
                  <button type="button" class="save-edit-btn" @click="saveEditedIngredient(index)">
                    ✓
                  </button>
                  <button type="button" class="cancel-edit-btn" @click="cancelEditingIngredient">
                    ×
                  </button>
                </div>
              </template>
              <template v-else>
                <span class="ingredient-text" @dblclick="startEditingIngredient(index, ingredient)">
                  {{ ingredient }}
                </span>
                <div class="ingredient-buttons">
                  <button
                    type="button"
                    class="edit-ingredient-btn"
                    @click="startEditingIngredient(index, ingredient)"
                  >
                    ✎
                  </button>
                  <button class="tooltip" @click="removeIngredient(index)">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                      height="25"
                      width="25"
                    >
                      <path
                        fill="#6361D9"
                        d="M8.78842 5.03866C8.86656 4.96052 8.97254 4.91663 9.08305 4.91663H11.4164C11.5269 4.91663 11.6329 4.96052 11.711 5.03866C11.7892 5.11681 11.833 5.22279 11.833 5.33329V5.74939H8.66638V5.33329C8.66638 5.22279 8.71028 5.11681 8.78842 5.03866ZM7.16638 5.74939V5.33329C7.16638 4.82496 7.36832 4.33745 7.72776 3.978C8.08721 3.61856 8.57472 3.41663 9.08305 3.41663H11.4164C11.9247 3.41663 12.4122 3.61856 12.7717 3.978C13.1311 4.33745 13.333 4.82496 13.333 5.33329V5.74939H15.5C15.9142 5.74939 16.25 6.08518 16.25 6.49939C16.25 6.9136 15.9142 7.24939 15.5 7.24939H15.0105L14.2492 14.7095C14.2382 15.2023 14.0377 15.6726 13.6883 16.0219C13.3289 16.3814 12.8414 16.5833 12.333 16.5833H8.16638C7.65805 16.5833 7.17054 16.3814 6.81109 16.0219C6.46176 15.6726 6.2612 15.2023 6.25019 14.7095L5.48896 7.24939H5C4.58579 7.24939 4.25 6.9136 4.25 6.49939C4.25 6.08518 4.58579 5.74939 5 5.74939H6.16667H7.16638ZM7.91638 7.24996H12.583H13.5026L12.7536 14.5905C12.751 14.6158 12.7497 14.6412 12.7497 14.6666C12.7497 14.7771 12.7058 14.8831 12.6277 14.9613C12.5495 15.0394 12.4436 15.0833 12.333 15.0833H8.16638C8.05588 15.0833 7.94989 15.0394 7.87175 14.9613C7.79361 14.8831 7.74972 14.7771 7.74972 14.6666C7.74972 14.6412 7.74842 14.6158 7.74584 14.5905L6.99681 7.24996H7.91638Z"
                        clip-rule="evenodd"
                        fill-rule="evenodd"
                      ></path>
                    </svg>
                    <span class="tooltiptext">remove</span>
                  </button>
                </div>
              </template>
            </li>
          </ul>
        </div>
        <input
          id="ingredients"
          v-model="newIngredient"
          type="text"
          @keypress="handleKeyPress"
          :class="{ valid: validations.ingredients }"
        />

        <button type="button" @click="addIngredient" class="button add-ingredient-btn">
          <span class="button__text">ADD INGREDIENT</span>
        </button>
      </div>

      <div class="form-group">
        <label for="instructions">Instructions (numbered steps) *</label>
        <span class="helper-text">
          Add one instruction per line.<br />
          Double-click or use the edit button to modify existing instructions.
        </span>
        <div class="instructions-container">
          <ul class="instructions-list">
            <li
              v-for="(instruction, index) in recipe.instructions"
              :key="index"
              class="instruction-item"
            >
              <template v-if="editingInstruction === index">
                <input
                  v-model="editedInstructionText"
                  type="text"
                  class="edit-instruction-input"
                  @keyup.enter="saveEditedInstruction(index)"
                  @keyup.esc="cancelEditingInstruction"
                  ref="editInput"
                  v-focus
                />
                <div class="edit-buttons">
                  <button type="button" class="save-edit-btn" @click="saveEditedInstruction(index)">
                    ✓
                  </button>
                  <button type="button" class="cancel-edit-btn" @click="cancelEditingInstruction">
                    ×
                  </button>
                </div>
              </template>
              <template v-else>
                <span
                  class="instruction-text"
                  @dblclick="startEditingInstruction(index, instruction)"
                >
                  {{ index + 1 }}. {{ instruction }}
                </span>
                <div class="instruction-buttons">
                  <button
                    type="button"
                    class="edit-instruction-btn"
                    @click="startEditingInstruction(index, instruction)"
                  >
                    ✎
                  </button>
                  <button class="tooltip" @click="removeInstruction(index)">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                      height="25"
                      width="25"
                    >
                      <path
                        fill="#6361D9"
                        d="M8.78842 5.03866C8.86656 4.96052 8.97254 4.91663 9.08305 4.91663H11.4164C11.5269 4.91663 11.6329 4.96052 11.711 5.03866C11.7892 5.11681 11.833 5.22279 11.833 5.33329V5.74939H8.66638V5.33329C8.66638 5.22279 8.71028 5.11681 8.78842 5.03866ZM7.16638 5.74939V5.33329C7.16638 4.82496 7.36832 4.33745 7.72776 3.978C8.08721 3.61856 8.57472 3.41663 9.08305 3.41663H11.4164C11.9247 3.41663 12.4122 3.61856 12.7717 3.978C13.1311 4.33745 13.333 4.82496 13.333 5.33329V5.74939H15.5C15.9142 5.74939 16.25 6.08518 16.25 6.49939C16.25 6.9136 15.9142 7.24939 15.5 7.24939H15.0105L14.2492 14.7095C14.2382 15.2023 14.0377 15.6726 13.6883 16.0219C13.3289 16.3814 12.8414 16.5833 12.333 16.5833H8.16638C7.65805 16.5833 7.17054 16.3814 6.81109 16.0219C6.46176 15.6726 6.2612 15.2023 6.25019 14.7095L5.48896 7.24939H5C4.58579 7.24939 4.25 6.9136 4.25 6.49939C4.25 6.08518 4.58579 5.74939 5 5.74939H6.16667H7.16638ZM7.91638 7.24996H12.583H13.5026L12.7536 14.5905C12.751 14.6158 12.7497 14.6412 12.7497 14.6666C12.7497 14.7771 12.7058 14.8831 12.6277 14.9613C12.5495 15.0394 12.4436 15.0833 12.333 15.0833H8.16638C8.05588 15.0833 7.94989 15.0394 7.87175 14.9613C7.79361 14.8831 7.74972 14.7771 7.74972 14.6666C7.74972 14.6412 7.74842 14.6158 7.74584 14.5905L6.99681 7.24996H7.91638Z"
                        clip-rule="evenodd"
                        fill-rule="evenodd"
                      ></path>
                    </svg>
                    <span class="tooltiptext">remove</span>
                  </button>
                </div>
              </template>
            </li>
          </ul>
        </div>
        <input
          id="instructions"
          v-model="newInstruction"
          type="text"
          @keypress="handleInstructionKeyPress"
        />
        <button type="button" @click="addInstruction" class="button add-instruction-btn">
          <span class="button__text">ADD INSTRUCTION</span>
        </button>
      </div>

      <div class="form-group">
        <label for="author">Author *</label>
        <span class="helper-text">Enter your name.</span>
        <input
          id="author"
          v-model="recipe.author"
          type="text"
          required
          :class="{ valid: validations.author }"
        />
      </div>

      <div class="form-group checkbox-group">
        <label class="checkbox-label">
          <input type="checkbox" v-model="recipe.favorite" />
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
  margin-left: 17.5rem;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 4rem;
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
.button {
  --main-focus: #db65a0;
  --font-color: #323232;
  --bg-color: rgb(246, 205, 151);
  --main-color: antiquewhite;
  position: relative;
  width: 150px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--main-color);
  box-shadow: 4px 4px var(--main-color);
  background-color: var(--bg-color);
  border-radius: 10px;
  transition: all 0.2s;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 6px 6px var(--main-color);
}

.button:active {
  transform: translate(4px, 4px);
  box-shadow: 0px 0px var(--main-color);
}

.button .button__text {
  color: var(--font-color);
  font-weight: 550;
  font-family: 'Poppins', sans-serif;
}

.button__icon {
  display: none;
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

.ingredients-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
#ingredients.valid {
  background-color: #f3f3f3;
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
.instructions-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.instruction-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background-color: antiquewhite;
  border-radius: 8px;
  transition: all 0.3s ease;
  width: 100%;
}

.instruction-item:hover {
  background-color: white;
  transform: translateX(4px);
  border: 2px solid antiquewhite;
  box-shadow: 0px 0px 0px 7px rgba(237, 171, 230, 0.2);
}

.instruction-text {
  color: #444;
  flex-grow: 1;
  margin-right: 0.5rem;
}

.instruction-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

#instructions {
  background-color: #f3f3f3;
}
#instructions:hover,
#instructions:focus {
  border: 2px solid antiquewhite;
  box-shadow: 0px 0px 0px 7px rgba(237, 171, 230, 0.2);
  background-color: white;
}

.edit-instruction-input {
  flex-grow: 1;
  padding: 0.5rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 4px;
  background-color: white;
  font-family: inherit;
  font-size: inherit;
}

.edit-buttons {
  display: flex;
  gap: 0.5rem;
}

.save-edit-btn,
.cancel-edit-btn,
.edit-instruction-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.save-edit-btn {
  background: #e8f5e9;
  color: #4caf50;
}

.save-edit-btn:hover {
  background: #4caf50;
  color: white;
}

.edit-instruction-btn {
  background: #e3f2fd;
  color: #2196f3;
}

.edit-instruction-btn:hover {
  background: #2196f3;
  color: white;
}

.instruction-buttons {
  display: flex;
  gap: 0.5rem;
}

.instruction-text {
  color: #444;
  flex-grow: 1;
  cursor: pointer;
}

.edit-ingredient-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: #ffeeee;
  color: #2196f3;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  border-radius: 6px;
  margin-left: 8px;
  transition: all 0.2s ease;
}

.edit-ingredient-btn:hover {
  background-color: #2196f3;
  color: white;
}

.ingredient-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.save-edit-btn,
.cancel-edit-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: #ffeeee;
  color: #2196f3;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.save-edit-btn:hover,
.cancel-edit-btn:hover {
  background-color: #ff44c4;
  color: white;
}

.edit-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.tooltip {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: #ffeeee;
  color: #ff4444;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
}

.tooltip svg {
  width: 18px;
  height: 18px;
}

.tooltip:hover {
  box-shadow: none;
  transform: scale(1.1);
  background-color: #ff4444;
  color: white;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 4em;
  background-color: white;
  color: #8f0e0e;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  top: 25%;
  left: 110%;
}

.tooltip .tooltiptext::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 100%;
  margin-top: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent rgba(0, 0, 0, 0.253) transparent transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>

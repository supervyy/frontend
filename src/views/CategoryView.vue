<template>
  <div class="recipe-list">
    <div class="categories-page">
      <h1>Categories</h1>
      <div class="categories-grid">
        <div
          v-for="(category, index) in categories"
          :key="index"
          class="category-card"
          @click="navigateToCategory(category.category)"
        >
          <h3>{{ category.category }}</h3>
          <p>{{ category.count }} recipe<span v-if="category.count > 1">s</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios'

const baseURL = import.meta.env.VITE_APP_BACKEND_BASE_URL
const apiEndpoint = baseURL+'/recipes'

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

export default {
  data() {
    return {
      categories: [
        { category: 'Appetizers', count: 0 },
        { category: 'Breakfast', count: 0 },
        { category: 'Main Course', count: 0 },
        { category: 'Dessert', count: 0 },
        { category: 'Drinks', count: 0 },
      ],
    };
  },
  methods: {
    async fetchRecipes() {
      try {
        const response = await axios.get<Recipe[]>(apiEndpoint)
        const recipes = response.data
        recipes.forEach((recipe: Recipe) => {
          const category = this.categories.find(cat => cat.category === recipe.category)
          if (category) {
            category.count += 1
          }
        })
        console.log('Fetched and counted recipes by category') // Hinzugefügt
      } catch (error) {
        console.error('Error fetching recipes:', error)
      }
    },
    navigateToCategory(category: string) {
      console.log(`Navigating to category: ${category}`) // Hinzugefügt
      this.$router.push({ name: 'RecipesByCategory', params: { category } })
    },
  },
  mounted() {
    this.fetchRecipes()
  },
};
</script>

<style scoped>
.recipe-list {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  position: absolute;
  align-items: center;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -20%);
}

.categories-page {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
}

.categories-page h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 3rem;
  font-size: 2.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.categories-grid {
  display: grid;
  justify-content: center;
  gap: 2rem;
  margin: 8rem auto;
  padding: 0 1rem;
  width: 100%;
}

.category-card {
  background: linear-gradient(135deg, antiquewhite 0%, antiquewhite 100%);
  color: #2c3e50;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #eee;
  width: 300px;
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  border-color: #e0e0e0;
}

.category-card h3 {
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
}

.category-card p {
  margin: 0;
  font-size: 1.1rem;
  color: #666;
}

@media screen and (min-width: 576px) {
  .categories-grid {
    grid-template-columns: repeat(2, 300px);
    justify-content: center;
  }
}

@media screen and (min-width: 992px) {
  .categories-grid {
    grid-template-columns: repeat(3, 300px);
    justify-content: center;
  }
}

@media screen and (max-width: 575px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }

  .category-card {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>

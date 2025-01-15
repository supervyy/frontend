import { createRouter, createWebHistory } from 'vue-router'
import CategoryView from '@/views/CategoryView.vue'
import FavoritesView from '@/views/FavoritesView.vue'
import RecipeDetailView from '@/components/RecipeDetailView.vue'
import RecipesCompositionApiView from '@/views/RecipesCompositionApiView.vue'
import CreateRecipe from '@/views/CreateRecipe.vue'
import EditRecipe from '@/components/EditRecipe.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesView
    },
    {
      path: '/',
      redirect: '/recipes-composition-api'
    },
    {
      path: '/recipes-composition-api',
      name: 'recipes-composition-api',
      component: RecipesCompositionApiView,
    },
    {
      path: '/category',
      name: 'category',
      component: CategoryView,
    },
    {
      path: '/recipes/:id',
      name: 'recipe-detail',
      component: RecipeDetailView,
      props: true // Ensure route params are passed as props
    },
    {
      path: '/recipes/category/:category',
      name: 'RecipesByCategory',
      component: RecipesCompositionApiView, // Changed component from CategoryView to RecipesCompositionApiList
    },
    {
      path: '/recipes/:id/edit',
      name: 'edit-recipe',
      component: EditRecipe,
      props: true
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/recipes-composition-api'
    },
    {
      path: '/create-recipe',
      name: 'create-recipe',
      component: CreateRecipe
    },
  ],
})

export default router

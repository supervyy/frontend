import { createRouter, createWebHistory } from 'vue-router'
import RecipesCompositionApiView from '@/views/RecipesCompositionApiView.vue'
import CategoryView from '@/views/CategoryView.vue'
import FavoritesView from '@/views/FavoritesView.vue'
import RecipeDetailView from '@/views/RecipeDetailView.vue'
import RecipesCompositionApiList from '@/components/RecipesCompositionApiList.vue'

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
      component: RecipesCompositionApiList, // Changed component from CategoryView to RecipesCompositionApiList
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/recipes-composition-api'
    }
  ],
})

export default router

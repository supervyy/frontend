import { createRouter, createWebHistory } from 'vue-router'
import RecipesCompositionApiView from '@/views/RecipesCompositionApiView.vue'
import CategoryView from '@/views/CategoryView.vue'
import HomeView from '@/views/HomeView.vue'
import RecipeDetailView from '@/views/RecipeDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/',
      redirect: '/home'
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
      path: '/:pathMatch(.*)*',
      redirect: '/home'
    }
  ],
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import RecipesCompositionApiView from '@/views/RecipesCompositionApiView.vue'
import CategoryView from '@/views/CategoryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [


    {
      path: '/recipes-composition-api',
      name: 'recipes-composition-api',
      component: RecipesCompositionApiView,
    },

    {
      path: '/category',
      name: 'category',
      component: CategoryView,
    }
  ],
})

export default router

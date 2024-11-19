import { createRouter, createWebHistory } from 'vue-router'
import RecipesCompositionApiView from '@/views/RecipesCompositionApiView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [


    {
      path: '/recipes-composition-api',
      name: 'recipes-composition-api',
      component: RecipesCompositionApiView,
    },

  ],
})

export default router

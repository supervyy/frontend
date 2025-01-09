import { describe, it, expect, vi } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import axios from 'axios'
import RecipesCompositionApiView from '../../views/RecipesCompositionApiView.vue'
import RecipesCompositionApiList from '../../components/RecipesCompositionApiList.vue'
import type { Recipe } from '../../model/recipe'

describe('RecipeListWithRestData', () => {
  vi.mock('axios')

  it('should display a message if the recipe list from the backend is empty', async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: [] })

    const wrapper = shallowMount(RecipesCompositionApiView)
    await flushPromises()

    expect(wrapper.text()).toContain('No recipes found!')
  })

  it('should render list from backend', async () => {
    const recipesResponse: Recipe[] = [
      {
        id: 1,
        name: 'Spaghetti Carbonara',
        description: 'A classic Italian pasta dish',
        image: 'https://i.pinimg.com/736x/fe/07/27/fe072747470c09eeadfcac3f450a130e.jpg',
        category: 'Main Course',
        ingredients: '400 g Spaghetti',
        instructions: 'Cook spaghetti in salted water',
        author: 'Chef Mario',
        favorite: false,
      },
      {
        id: 2,
        name: 'Tiramisu',
        description: 'A classic Italian dessert',
        image: 'https://i.pinimg.com/736x/eb/67/cd/eb67cdd4329512df261dcde1dce229f9.jpg',
        category: 'Dessert',
        ingredients: '500 g Mascarpone',
        instructions: 'Mix mascarpone with sugar and eggs',
        author: 'Chef Luigi',
        favorite: false,
      },
    ]
    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: recipesResponse })

    const wrapper = shallowMount(RecipesCompositionApiView)
    await flushPromises()

    expect(wrapper.find('#recipe-container').exists()).toBeTruthy()
    expect(wrapper.findAllComponents(RecipesCompositionApiList).length).toBe(recipesResponse.length)
  })
})

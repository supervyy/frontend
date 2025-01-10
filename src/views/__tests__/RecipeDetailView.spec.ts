import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import axios from 'axios'
import RecipeDetailView from '../RecipeDetailView.vue'
import { useRoute, useRouter } from 'vue-router'

vi.mock('axios')
vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn(),
}))

describe('RecipeDetailView', () => {
  const mockRoute = {
    params: {
      id: '1',
    },
  }

  const mockRouter = {
    push: vi.fn(),
  }

  beforeEach(() => {
    vi.mocked(useRoute).mockReturnValue(mockRoute as any)
    vi.mocked(useRouter).mockReturnValue(mockRouter as any)
  })

  it('should display recipe details when loaded', async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({
      data: {
        id: 1,
        name: 'Spaghetti',
        description: 'Italian pasta dish',
        image: 'spaghetti.jpg',
        category: 'Main Course',
        ingredients: 'Pasta, Tomatoes',
        instructions: '1. Cook pasta',
        author: 'Chef Mario',
      },
    })

    const wrapper = shallowMount(RecipeDetailView)

    await flushPromises()
    expect(wrapper.find('.recipe-title').text()).toBe('Spaghetti')
    expect(wrapper.find('.recipe-description').text()).toBe('Italian pasta dish')
  })

  it('should navigate to category page when clicking category', async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({
      data: {
        id: 1,
        name: 'Test Recipe',
        category: 'Dessert',
      },
    })

    const wrapper = shallowMount(RecipeDetailView)

    await flushPromises()
    const categoryElement = wrapper.find('.category-input')
    expect(categoryElement.exists()).toBe(true)
    await categoryElement.trigger('click')
    expect(mockRouter.push).toHaveBeenCalledWith('/recipes/category/Dessert')
  })
})

import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import axios from 'axios'
import RecipeDetailView from '../RecipeDetailView.vue'

vi.mock('axios')
const mockRoute = {
  params: {
    id: '1',
  },
}

describe('RecipeDetailView', () => {
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

    const wrapper = mount(RecipeDetailView, {
      global: {
        mocks: {
          $route: mockRoute,
          $router: {
            push: vi.fn(),
          },
        },
      },
    })

    await flushPromises()
    expect(wrapper.find('.recipe-title').text()).toBe('Spaghetti')
    expect(wrapper.find('.recipe-description').text()).toBe('Italian pasta dish')
  })

  it('should handle recipe not found error', async () => {
    vi.mocked(axios, true).get.mockRejectedValueOnce({
      response: { status: 404 },
    })

    const wrapper = mount(RecipeDetailView, {
      global: {
        mocks: {
          $route: mockRoute,
          $router: {
            push: vi.fn(),
          },
        },
      },
    })

    await flushPromises()
    expect(wrapper.text()).toContain('Recipe not found')
  })

  it('should navigate to category page when clicking category', async () => {
    const mockRouter = {
      push: vi.fn(),
    }

    vi.mocked(axios, true).get.mockResolvedValueOnce({
      data: {
        id: 1,
        category: 'Dessert',
      },
    })

    const wrapper = mount(RecipeDetailView, {
      global: {
        mocks: {
          $route: mockRoute,
          $router: mockRouter,
        },
      },
    })

    await flushPromises()
    await wrapper.find('.category-input').trigger('click')
    expect(mockRouter.push).toHaveBeenCalledWith('/recipes/category/Dessert')
  })
})

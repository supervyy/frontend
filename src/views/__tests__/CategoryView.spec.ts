import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import axios from 'axios'
import CategoryView from '../CategoryView.vue'

vi.mock('axios')

describe('CategoryView', () => {
  it('should display categories with the correct counts', async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({
      data: [
        { id: 1, category: 'Dessert' },
        { id: 2, category: 'Main Course' },
        { id: 3, category: 'Dessert' },
      ],
    })
    const wrapper = mount(CategoryView)
    await flushPromises()

    const dessertCard = wrapper
      .findAll('.category-card')
      .find((card) => card.text().includes('Dessert'))
    expect(dessertCard?.text()).toContain('2 recipes')

    const mainCourseCard = wrapper
      .findAll('.category-card')
      .find((card) => card.text().includes('Main Course'))
    expect(mainCourseCard?.text()).toContain('1 recipe')
  })

  it('should handle API errors', async () => {
    vi.mocked(axios, true).get.mockRejectedValueOnce(new Error('API Error'))
    const wrapper = mount(CategoryView)
    await flushPromises()
    expect(wrapper.text()).toContain('Error fetching recipes')
  })

  it('should navigate to the selected category', async () => {
    const mockRouter = {
      push: vi.fn(),
    }

    const wrapper = mount(CategoryView, {
      global: {
        mocks: {
          $router: mockRouter,
        },
      },
    })

    await wrapper.find('.category-card').trigger('click')

    expect(mockRouter.push).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'RecipesByCategory',
        params: expect.any(Object),
      }),
    )
  })
})

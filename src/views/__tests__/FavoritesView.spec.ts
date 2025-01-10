import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import axios from 'axios'
import FavoritesView from '../FavoritesView.vue'

vi.mock('axios')

describe('FavoritesView', () => {
  it('should display a message if no favorite recipes are found', async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: [] })
    const wrapper = mount(FavoritesView)
    await flushPromises()
    expect(wrapper.text()).toContain('No favorite recipes found!')
  })

  it('should list favorite recipes', async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({
      data: [
        { id: 1, name: 'Lasagna', image: 'lasagne.jpg', favorite: true },
        { id: 2, name: 'Pizza', image: 'pizza.jpg', favorite: true },
      ],
    })
    const wrapper = mount(FavoritesView)
    await flushPromises()
    expect(wrapper.findAll('.recipe-card').length).toBe(2)
  })
})

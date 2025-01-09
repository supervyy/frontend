export interface Recipe {
  readonly id: number
  name: string
  description: string
  image: string
  category: string
  ingredients: string
  instructions: string
  author: string
  favorite: boolean
}

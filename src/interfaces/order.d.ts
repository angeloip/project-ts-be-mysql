export interface Order {
  products: Product[]
  total: number
  quantity: number
  state: 'Realizado' | 'Pendiente'
  user: ""
}

export interface Product {
  name: string
  price: number
  quantity: number
  discountPercentage: number
  subtotal: number
  category: ""
}

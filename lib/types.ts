export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  images?: string[] // Multiple images for product gallery
  category: string
  subcategory: string
  type: string
  inStock: boolean
  bestSeller?: boolean
  productCode?: string
  designNumber?: string
  metalClarity?: string
  shape?: string
  size?: string
  purityKarat?: string
  grossWeightGram?: number
  netWeight?: number
  color?: string
  tags?: string[]
  metalValue?: number
  stoneValue?: number
  variant?: string

}

export interface CustomProduct extends Product {
  isCustom: true
}

export interface CartItem {
  product: Product | CustomProduct
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  totalPrice: number
  date: string
  status: "completed" | "processing" | "shipped"
}

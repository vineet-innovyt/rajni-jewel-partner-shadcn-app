import { OrderLineItemEntity } from "@/services/entities"

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


export type CartItem = OrderLineItemEntity;

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  totalPrice: number
  date: string
  status: "completed" | "processing" | "shipped"
}

export interface IProductMetadata {
  style?: string,
  menuHeader?: string,
  metalColor?: string,
  metalType?: string,
  metalPurity?: string,
  stoneWeightCt?: number,
  stoneWeightGm?: number,
  lengthInch?: string,
  metalRate?: number,
  metalValue?: number,
  makingCharges?: number,
  discountMakingCharges?: number,
  finalMakingCharges?: number,
  costPerGram?: number
}
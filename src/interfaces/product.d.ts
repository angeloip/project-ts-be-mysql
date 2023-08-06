import { RowDataPacket } from "mysql2"

export interface Product extends RowDataPacket {
  name: string
  description: string
  price: number
  discountPercentage?: number
  rating?: number
  stock: number
  category: string
}



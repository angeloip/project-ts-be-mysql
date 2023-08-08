import { RowDataPacket } from "mysql2"
import { Category } from "./category"
import { ParsedQs } from "qs"

export interface Product extends RowDataPacket {
  name: string
  description: string
  price: number
  discountPercentage?: number
  rating?: number
  stock: number
  category: int | Category
}


export interface Querys extends ParsedQs {
  name: string
  key: string
  order: string
  min: string
  max: string
}
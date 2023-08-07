import { RowDataPacket } from "mysql2"

export interface Auth {
  email: string
  password: string
}

export interface Avatar {
  url: string
  public_id: string
}

export interface User extends RowDataPacket {
  _id?: string
  name: string
  email: string
  password: string
  isAdmin?: boolean
  avatar?: Avatar
  createdAt?: Date
}

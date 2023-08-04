export interface Auth {
  email: string
  password: string
}

export interface Avatar {
  url: string
  public_id: string
}

export interface User {
  _id?: string
  name: string
  email: string
  password: string
  avatar?: Avatar
  createdAt?: Date
}

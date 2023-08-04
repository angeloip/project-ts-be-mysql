import { User } from '../interfaces/user'
import { UserModel } from '../models/user'

export const createUser = async (user: User) => {
  const response = new UserModel(user)
  return await response.save()
}

export const getUsers = async () => {
  const response = await UserModel.find({})
  return response
}

export const getUser = async (id: string) => {
  const response = await UserModel.findById(id)
  return response
}

export const getUserByEmail = async (email: string) => {
  const response = await UserModel.findOne(
    { email },
    { createdAt: 0, updatedAt: 0 }
  )
  return response
}

export const updateUser = async (id: string, data: User) => {
  const response = await UserModel.findByIdAndUpdate(id, data, { new: true })
  return response
}

export const deleteUser = async (id: string) => {
  const response = await UserModel.findByIdAndDelete(id)
  return response
}

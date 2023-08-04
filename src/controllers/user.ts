import { NextFunction, Request, Response } from 'express'
import { UserModel } from '../models/user'

export const userController = {
  getUsers: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UserModel.find({})

      return res.status(200).json(users)
    } catch (error) {
      next(error)
    }
  }
}

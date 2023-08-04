import { NextFunction, Request, Response } from 'express'
import { registerNewUser } from '../services/auth'
import { getUserByEmail } from '../services/user'
import { verify } from 'jsonwebtoken'
import { access, refresh } from '../helpers/jwt'
import { UserModel } from '../models/user'
import { verified } from '../helpers/bcrypt'
import { RequestExt } from '../interfaces/req-ext'

export const authController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.body
      const responseUser = await getUserByEmail(user.email)

      if (responseUser)
        return res.status(400).json({ msg: 'El correo ya está en uso' })

      await registerNewUser(user)

      return res.status(200).json({ msg: 'Usuario registrado' })
    } catch (error) {
      next(error)
    }
  },
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body

      const user = await UserModel.findOne({ email: email })

      if (!user) return res.status(400).json({ msg: 'Usuario no encontrado' })

      const isMatch = await verified(password, user.password)

      if (!isMatch)
        return res.status(400).json({ msg: 'Contraseña incorrecta' })

      const rf_token = refresh(user._id.toString())

      res.cookie('rftoken', rf_token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax'
      })

      return res.status(200).json({ name: user.name })
    } catch (error) {
      next(error)
    }
  },
  accessToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rf_token: string = req.cookies.rftoken

      if (!rf_token)
        return res
          .status(400)
          .json({ msg: 'Por favor, inicie sesión nuevamente' })

      verify(rf_token, process.env.REFRESH_TOKEN as string, (err, user) => {
        if (err)
          return res
            .status(400)
            .json({ msg: 'Por favor, inicie sesión nuevamente' })

        const userToken = user as { id: string }
        const ac_token = access(userToken.id)

        return res.status(200).json({ ac_token })
      })
    } catch (error) {
      next(error)
    }
  },
  getAuthUser: async (req: RequestExt, res: Response, next: NextFunction) => {
    try {
      const user = await UserModel.findById(req.user?.id)

      return res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  },
  logout: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie('rftoken')

      return res.status(200).json({ msg: 'Ha cerrado sesión' })
    } catch (error) {
      next(error)
    }
  }
}

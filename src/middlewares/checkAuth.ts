import { NextFunction, Response } from 'express'
import { RequestExt } from '../interfaces/req-ext'
import { verifyToken } from '../helpers/jwt'

export const checkAuth = (
  req: RequestExt,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization

    if (!token) return res.status(401).json({ msg: 'Autenticación fallida' })

    const jwt = token.split(' ').pop()

    const user = verifyToken(jwt as string)

    if (!user) return res.status(401).json({ msg: 'Actualice nuevamente' })

    req.user = user as { id: string }

    next()
  } catch (error) {
    next(error)
  }
}

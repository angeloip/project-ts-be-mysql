import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { access, refresh } from '../helpers/jwt'
import { verified } from '../helpers/bcrypt'
import { RequestExt } from '../interfaces/req-ext'
import { User } from '../interfaces/user'
import { pool } from '../config/connection'

export const authController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password }: User = req.body

      const query = 'SELECT * FROM users WHERE email = ?';
      const [rows] = await pool.query<User[]>(query, [email]);

      if (rows.length > 0) return res.status(400).json({ msg: 'El correo ya está en uso' });

      const query2 = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      await pool.query(query2, [name, email, password]);

      return res.status(200).json({ msg: 'Usuario registrado' })
    } catch (error) {
      next(error)
    }
  },
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password }: User = req.body

      const query = 'SELECT * FROM users WHERE email = ?';
      const [rows] = await pool.query<User[]>(query, [email]);

      if (rows.length === 0) return res.status(400).json({ msg: 'Usuario no encontrado' });

      const isMatch = await verified(password, rows[0].password);

      if (!isMatch)
        return res.status(400).json({ msg: 'Contraseña incorrecta' })

      const user = rows[0];

      const rf_token = refresh(user._id as string)

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

      const query = 'SELECT * FROM users WHERE _id = ?';
      const [rows] = await pool.query<User[]>(query, [req.user?.id]);

      return res.status(200).json(rows[0])
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

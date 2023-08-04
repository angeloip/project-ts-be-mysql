import { JsonWebTokenError, sign, verify } from 'jsonwebtoken'

export const refresh = (id: string) => {
  return sign({ id }, process.env.REFRESH_TOKEN as string, {
    expiresIn: '24h'
  })
}

export const access = (id: string) => {
  return sign({ id }, process.env.ACCESS_TOKEN as string, { expiresIn: '15m' })
}

export const verifyToken = (token: string) => {
  try {
    return verify(token, process.env.ACCESS_TOKEN as string)
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return null
    } else {
      throw error
    }
  }
}

import { Auth, User } from '../interfaces/user'
import { encrypt, verified } from '../helpers/bcrypt'
import { refresh } from '../helpers/jwt'
import { createUser, getUserByEmail } from './user'

export const registerNewUser = async ({ name, email, password }: User) => {
  const passHash = await encrypt(password)
  return await createUser({ name, email, password: passHash })
}

export const loginUser = async ({ email, password }: Auth) => {
  const user = await getUserByEmail(email)
  if (!user) return 'USER_NOT_FOUND'
  const isMatch = await verified(password, user.password)
  if (!isMatch) return 'INCORRECT_PASSWORD'

  const token = refresh(user._id)

  return token
}

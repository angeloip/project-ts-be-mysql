import { Router } from 'express'
import { userController } from '../controllers/user'

const router = Router()

router.get('/', userController.getUsers)

export { router }

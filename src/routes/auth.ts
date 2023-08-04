import { Router } from 'express'
import { authController } from '../controllers/auth'
import { checkAuth } from '../middlewares/checkAuth'

const router = Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/access', authController.accessToken)
router.get('/user', checkAuth, authController.getAuthUser)
router.post('/logout', authController.logout)

export { router }

import { Router } from 'express'
import { orderController } from '../controllers/order'
import { checkAuth } from '../middlewares/checkAuth'

const router = Router()

router.post('/', checkAuth, orderController.createOrder)

export { router }

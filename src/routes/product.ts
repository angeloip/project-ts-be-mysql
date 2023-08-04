import { Router } from 'express'
import { multerMiddleware } from '../middlewares/file'
import { productController } from '../controllers/product'

const router = Router()

router.post('/', multerMiddleware, productController.createProduct)
router.get('/', productController.getProducts)
router.get('/:id', productController.getProduct)
router.post('/category', productController.getProductsByCategory)
router.patch('/:id', productController.updateProduct)
router.patch('/image/:id', multerMiddleware, productController.updatePicture)
router.delete('/:id', productController.deleteProduct)

export { router }

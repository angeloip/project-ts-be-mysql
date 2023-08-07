import { Router } from 'express'
import { productController } from '../controllers/product'
import { multerMiddleware } from '../middlewares/file'

const router = Router()

router.post('/', multerMiddleware, productController.createProduct)
router.get('/', productController.getProducts)
router.get('/:id', productController.getProduct)
router.post('/category', productController.getProductsByCategory)
router.patch('/:id', productController.updateProduct)
router.delete('/:id', productController.deleteProduct)
/* 
router.post('/category', productController.getProductsByCategory)
router.patch('/image/:id', multerMiddleware, productController.updatePicture) */

export { router }

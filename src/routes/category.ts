import { Router } from 'express'
import { categoryController } from '../controllers/category'

const router = Router()

router.get('/:id', categoryController.getCategory)
router.get('/', categoryController.getCategories)
router.post('/', categoryController.createCategory)
router.patch('/:id', categoryController.updateCategory)
router.delete('/:id', categoryController.deleteCategory)

export { router }

import { NextFunction, Request, Response } from 'express'
import { CategoryModel } from '../models/category'
import { ProductModel } from '../models/product'

export const categoryController = {
  getCategories: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await CategoryModel.find({})

      return res.status(200).json(categories)
    } catch (error) {
      next(error)
    }
  },
  getCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      try {
        const { id } = req.params

        const category = await CategoryModel.findById(id)

        if (!category)
          return res.status(404).json({ msg: 'Categoría no existente' })

        return res.status(200).json(category)
      } catch (error) {
        next(error)
      }
    } catch (error) {
      next(error)
    }
  },
  createCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = req.body

      const categoryExist = await CategoryModel.findOne({ name: category.name })

      if (categoryExist)
        return res.status(406).json({ msg: 'Categoría existente' })

      const newCategory = new CategoryModel(category)
      await newCategory.save()

      return res.status(200).json({ msg: 'Categoría creada' })
    } catch (error) {
      next(error)
    }
  },
  updateCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const newCategoryInfo = req.body

      const category = await CategoryModel.findById(id)

      if (!category)
        return res.status(404).json({ msg: 'Categoría no existente' })

      await CategoryModel.findByIdAndUpdate(id, newCategoryInfo, {
        new: true
      })

      return res.status(200).json({ msg: 'Categoría actualizada' })
    } catch (error) {
      next(error)
    }
  },
  deleteCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params

      const category = await CategoryModel.findById(id)

      if (!category)
        return res.status(404).json({ msg: 'Categoría no existente' })

      const product = await ProductModel.findOne({ category: category._id })

      if (product)
        return res.status(406).json({
          msg: 'No es posible eliminar la categoría, ya que existe productos con dicha categoría'
        })

      await CategoryModel.findByIdAndRemove(id)

      return res.status(200).json({ msg: 'Categoría eliminada' })
    } catch (error) {
      next(error)
    }
  }
}

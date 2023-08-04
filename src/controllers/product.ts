import { NextFunction, Request, Response } from 'express'
import { ProductModel } from '../models/product'
import { remove } from 'fs-extra'
import {
  deleteProductPicture,
  uploadProductPicture
} from '../helpers/cloudinary'
import { CategoryModel } from '../models/category'

export const productController = {
  getProducts: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await ProductModel.find({}).populate('category', 'name')
      return res.status(200).json(products)
    } catch (error) {
      next(error)
    }
  },
  getProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const product = await ProductModel.findById(id).populate(
        'category',
        'name'
      )
      if (!product)
        return res.status(400).json({ msg: 'Producto no encontrado' })

      return res.status(200).json(product)
    } catch (error) {
      next(error)
    }
  },
  getProductsByCategory: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { name, key, order, min, max } = req.query

      const category = await CategoryModel.findOne({ name })

      if (!category) {
        return res.status(404).json({ msg: 'Categoría no encontrada' })
      }

      const orderMap = {
        name: 'name',
        price: 'price'
      }

      const orderByField = orderMap[key as keyof typeof orderMap]
      const sortOrder = order === 'desc' ? -1 : 1

      const query: any = { category: category._id }

      if (min && max) {
        query.price = {
          $gte: min,
          $lte: max
        }
      }

      const products = await ProductModel.find(query)
        .sort({ [orderByField]: sortOrder })
        .populate('category', 'name')

      return res.status(200).json(products)
    } catch (error) {
      next(error)
    }
  },
  createProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = req.body

      const category = await CategoryModel.findOne({ name: product.category })

      if (!category)
        return res.status(400).json({ msg: 'Categoría no encontrada' })

      product.category = category._id

      if (req.file) {
        const result = await uploadProductPicture(req.file.path)
        await remove(req.file.path)
        const image = {
          url: result.secure_url,
          public_id: result.public_id
        }
        product.thumbnail = image
      }

      const newProduct = new ProductModel(product)
      await newProduct.save()

      return res.status(200).json({ msg: 'Producto creado' })
    } catch (error) {
      next(error)
    }
  },
  updateProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const newProductInfo = req.body

      const product = await ProductModel.findById(id)
      if (!product)
        return res.status(400).json({ msg: 'Producto no encontrado' })

      const category = await CategoryModel.findOne({
        name: newProductInfo.category
      })

      if (!category)
        return res.status(400).json({ msg: 'Categoría no encontrada' })

      newProductInfo.category = category._id

      await ProductModel.findByIdAndUpdate(id, newProductInfo, {
        new: true
      })
      return res.status(200).json({ msg: 'Producto actualizado' })
    } catch (error) {
      next(error)
    }
  },
  updatePicture: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params

      const product = await ProductModel.findById(id)

      if (!product)
        return res.status(404).json({ msg: 'Producto no existente' })

      let image = null

      if (req.file) {
        if (product.thumbnail.public_id === '') {
          const result = await uploadProductPicture(req.file.path)
          await remove(req.file.path)
          image = {
            url: result.secure_url,
            public_id: result.public_id
          }
        } else {
          await deleteProductPicture(product.thumbnail.public_id)
          const result = await uploadProductPicture(req.file.path)
          await remove(req.file.path)
          image = {
            url: result.secure_url,
            public_id: result.public_id
          }
        }
        product.thumbnail.url = image.url
        product.thumbnail.public_id = image.public_id

        await ProductModel.findByIdAndUpdate(id, product, {
          new: true
        })

        return res.status(200).json({ msg: 'Imagen actualizada' })
      } else {
        return res
          .status(400)
          .json({ msg: 'No se ha seleccionado ninguna imagen' })
      }
    } catch (error) {
      next(error)
    }
  },
  deleteProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const product = await ProductModel.findById(id)
      if (!product)
        return res.status(400).json({ msg: 'Producto no encontrado' })

      const deletedProduct = await ProductModel.findByIdAndDelete(id)

      if (deletedProduct && deletedProduct.thumbnail.public_id) {
        await deleteProductPicture(deletedProduct.thumbnail.public_id)
      }

      return res.status(200).json({ msg: 'Producto eliminado' })
    } catch (error) {
      next(error)
    }
  }
}

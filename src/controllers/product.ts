import { NextFunction, Request, Response } from 'express'
import { pool } from '../config/connection'
import { Product } from '../interfaces/product';
import { ResultSetHeader } from 'mysql2/promise';

export const productController = {
  getProducts: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const query = 'SELECT * FROM products';
      const [rows] = await pool.query<Product[]>(query);

      return res.status(200).json(rows);
    } catch (error) {
      next(error)
    }
  },
  getProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const query = 'SELECT * FROM products WHERE id = ?';
      const [rows] = await pool.query<Product[]>(query, [id]);

      if (rows.length === 0) return res.status(404).json({ msg: 'Producto no encontrado' });

      return res.status(200).json(rows[0]);
    } catch (error) {
      next(error)
    }
  },
  /* getProductsByCategory: async (
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
  }, */
  createProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, price, stock, category }: Product = req.body;

      const query = 'INSERT INTO products (name, description, price, stock, category) VALUES (?, ?, ?, ?, ?)';
      await pool.query(query, [name, description, price, stock, category]);

      return res.status(201).json({ msg: 'Producto Creado' });
    } catch (error) {
      next(error)
    }
  },
  updateProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updatedProduct: Partial<Product> = req.body;

      const updateQuery = 'UPDATE products SET ? WHERE id = ?';
      const [result] = await pool.query<ResultSetHeader>(updateQuery, [updatedProduct, id]);

      if (result.affectedRows === 0) return res.status(404).json({ msg: 'Producto no encontrado' });

      return res.status(200).json({ msg: 'Producto actualizado' });
    } catch (error) {
      next(error)
    }
  },
  /* updatePicture: async (req: Request, res: Response, next: NextFunction) => {
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
  }, */
  deleteProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const query = 'DELETE FROM products WHERE id = ?';
      const [result] = await pool.query<ResultSetHeader>(query, [id]);

      if (result.affectedRows === 0) return res.status(404).json({ msg: 'Producto no encontrado' });

      return res.status(200).json({ msg: 'Producto eliminado' });
    } catch (error) {
      next(error)
    }
  }
}

import { NextFunction, Request, Response } from 'express'
import { pool } from '../config/connection'
import { Product, Querys } from '../interfaces/product'
import { ResultSetHeader } from 'mysql2/promise'
import { uploadProductPicture } from '../helpers/cloudinary'
import { remove } from 'fs-extra'
import data from "./data.json"

export const productController = {
  getProducts: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const query = `
      SELECT p.*, JSON_OBJECT('_id', c._id, 'name', c.name) AS category
      FROM products p
      JOIN categories c ON p.category = c._id`

      const [rows] = await pool.query<Product[]>(query)

      return res.status(200).json(rows)
    } catch (error) {
      next(error)
    }
  },
  getProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const query = `
      SELECT p.*, JSON_OBJECT('_id', c._id, 'name', c.name) AS category
      FROM products p
      JOIN categories c ON p.category = c._id
      WHERE p._id = ?`

      const [rows] = await pool.query<Product[]>(query, [id])

      if (rows.length === 0)
        return res.status(404).json({ msg: 'Producto no encontrado' })

      return res.status(200).json(rows[0])
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
      const { name, key, order, min, max } = req.query as Querys;

      let orderByClause = '';
      if (key && order) {
        const allowedKeys = ['name', 'price'];
        const allowedOrders = ['asc', 'desc'];
        if (allowedKeys.includes(key) && allowedOrders.includes(order)) {
          orderByClause = `ORDER BY ${key} ${order.toUpperCase()}`;
        }
      }

      const queryParams = [name];

      let filterByPriceClause = '';
      if (min && max) {
        const parsedMin = parseFloat(min);
        const parsedMax = parseFloat(max);
        if (!isNaN(parsedMin) && !isNaN(parsedMax)) {
          filterByPriceClause = 'AND p.price BETWEEN ? AND ?';
          queryParams.push(parsedMin.toString(), parsedMax.toString());
        }
      }

      const query = `
        SELECT 
          p.*,
          JSON_OBJECT('_id', c._id, 'name', c.name) as category
        FROM products p
        JOIN categories c ON p.category = c._id
        WHERE c.name = ?
        ${filterByPriceClause}
        ${orderByClause}
      `;

      const [rows] = await pool.query<Product[]>(query, queryParams);

      return res.status(200).json(rows);
    } catch (error) {
      next(error);
    }
  },
  createProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, price, stock, category }: Product = req.body

      let thumbnail = null

      if (req.file) {
        const result = await uploadProductPicture(req.file.path)
        await remove(req.file.path)
        thumbnail = JSON.stringify({
          url: result.secure_url,
          public_id: result.public_id
        })
      }

      const query = `INSERT INTO products (name, description, price, stock, category ${thumbnail ? ', thumbnail' : ''
        }) VALUES (?, ?, ?, ?, ? ${thumbnail ? ', ?' : ''})`

      const values = [name, description, price, stock, category]
      if (thumbnail) values.push(thumbnail)

      await pool.query(query, values)

      return res.status(201).json({ msg: 'Producto Creado' })
    } catch (error) {
      next(error)
    }
  },
  updateProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const updatedProduct: Partial<Product> = req.body

      const updateQuery = 'UPDATE products SET ? WHERE _id = ?'
      const [result] = await pool.query<ResultSetHeader>(updateQuery, [
        updatedProduct,
        id
      ])

      if (result.affectedRows === 0)
        return res.status(404).json({ msg: 'Producto no encontrado' })

      return res.status(200).json({ msg: 'Producto actualizado' })
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
      const { id } = req.params
      const query = 'DELETE FROM products WHERE _id = ?'
      const [result] = await pool.query<ResultSetHeader>(query, [id])

      if (result.affectedRows === 0)
        return res.status(404).json({ msg: 'Producto no encontrado' })

      return res.status(200).json({ msg: 'Producto eliminado' })
    } catch (error) {
      next(error)
    }
  },
  CreateProducts: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const values: any[] = [];
      let placeholders = '';

      data.forEach((product, index) => {
        const { name, description, price, stock, category, thumbnail } = product;
        values.push(name, description, price, stock, category, JSON.stringify(thumbnail));

        if (index === 0) {
          placeholders = '(?, ?, ?, ?, ?, ?)';
        } else {
          placeholders += ', (?, ?, ?, ?, ?, ?)';
        }
      });

      const query = `
      INSERT INTO products (name, description, price, stock, category, thumbnail)
      VALUES ${placeholders}
    `;

      await pool.query(query, values);

      return res.status(201).json({ msg: 'Productos Creados' });
    } catch (error) {
      next(error)
    }
  }
}

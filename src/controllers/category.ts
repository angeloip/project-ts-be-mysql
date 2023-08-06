import { NextFunction, Request, Response } from 'express'
import { pool } from '../config/connection';
import { Category } from '../interfaces/category';
import { ResultSetHeader } from 'mysql2';

export const categoryController = {
  getCategories: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const query = 'SELECT * FROM categories';
      const [rows] = await pool.query<Category[]>(query);

      return res.status(200).json(rows);
    } catch (error) {
      next(error)
    }
  },
  getCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const query = 'SELECT * FROM categories WHERE _id = ?';
      const [rows] = await pool.query<Category[]>(query, [id]);

      if (rows.length === 0) return res.status(404).json({ msg: 'Categoría no encontrada' });

      return res.status(200).json(rows[0]);
    } catch (error) {
      next(error)
    }
  },
  createCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name }: Category = req.body;

      const query = 'INSERT INTO categories (name) VALUES (?)';
      await pool.query(query, [name]);

      return res.status(201).json({ msg: 'Categoría Creada' });
    } catch (error) {
      next(error)
    }
  },
  updateCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updatedCategory: Partial<Category> = req.body;

      const updateQuery = 'UPDATE categories SET ? WHERE _id = ?';
      const [result] = await pool.query<ResultSetHeader>(updateQuery, [updatedCategory, id]);

      if (result.affectedRows === 0) return res.status(404).json({ msg: 'Categoría no encontrada' });

      return res.status(200).json({ msg: 'Categoría actualizado' });
    } catch (error) {
      next(error)
    }
  },
  deleteCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const query = 'DELETE FROM categories WHERE _id = ?';
      const [result] = await pool.query<ResultSetHeader>(query, [id]);

      if (result.affectedRows === 0) return res.status(404).json({ msg: 'Categoría no encontrada' });

      return res.status(200).json({ msg: 'Categoría eliminada' });
    } catch (error) {
      next(error)
    }
  }
}

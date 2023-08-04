import { NextFunction, Response } from 'express'
import { RequestExt } from '../interfaces/req-ext'
import { OrderModel } from '../models/order';

export const orderController = {
  createOrder: async (req: RequestExt, res: Response, next: NextFunction) => {
    try {
      const order = req.body;
      const newOrder = new OrderModel(order);
      await newOrder.save();
      return res.status(200).json({ msg: 'Pedido realizado con éxito' });
    } catch (error) {
      next(error)
    }
  }
}

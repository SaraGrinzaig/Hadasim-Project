import { Request, Response } from 'express';
import OrderService from '../services/order.service';

class OrderController {
    
  async create(req: Request, res: Response) {
    try {
      const order = await OrderService.createOrder(req.body);
      res.status(201).json(order);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to create order', details: err.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const orders = await OrderService.getAllOrders();
      res.json(orders);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to get orders', details: err.message });
    }
  }

  async getBySupplier(req: Request, res: Response) {
    try {
      const { supplierId } = req.params;
      const orders = await OrderService.getOrdersBySupplier(supplierId);
      res.json(orders);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to get supplier orders', details: err.message });
    }
  }

  async getByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;
      const orders = await OrderService.getOrdersByStatus(status);
      res.json(orders);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to get orders by status', details: err.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const updatedOrder = await OrderService.updateOrderStatus(orderId, status);
      res.json(updatedOrder);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update order status', details: err.message });
    }
  }
}

export default new OrderController();
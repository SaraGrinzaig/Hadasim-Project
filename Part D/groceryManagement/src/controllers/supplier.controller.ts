import { Request, Response } from 'express';
import SupplierService from '../services/supplier.service';

class SupplierController {
  async register(req: Request, res: Response) {
    try {
      const result = await SupplierService.registerSupplier(req.body);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(500).json({ error: 'Registration failed', details: err.message });
    }
  }

  async getAll(req: Request, res: Response) {
      try {
        const Suppliers = await SupplierService.getAllSuppliers();
        res.json(Suppliers);
      } catch (err: any) {
        res.status(500).json({ error: 'Failed to get Suppliers', details: err.message });
      }
    }
}

export default new SupplierController();
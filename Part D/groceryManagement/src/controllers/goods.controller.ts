import { Request, Response } from 'express';
import GoodsService from '../services/goods.service';

class GoodsController {

  async getAll(req: Request, res: Response) {
    try {
      const Goods = await GoodsService.getAllGoods();
      res.json(Goods);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to get Goods', details: err.message });
    }
  }

  async getBySupplier(req: Request, res: Response) {
    try {
      const { supplierId } = req.params;
      const Goods = await GoodsService.getGoodsBySupplier(supplierId);
      res.json(Goods);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to get supplier Goods', details: err.message });
    }
  }

}

export default new GoodsController();
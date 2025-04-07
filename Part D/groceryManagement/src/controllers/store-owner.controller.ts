import { Request, Response } from 'express';
import storeOwnerService from "../services/store-owner.service";

class StoreOwnerController {

  async login(req: Request, res: Response) {
    try {
      const result = await storeOwnerService.login(req.body);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: 'Login failed', details: err.message });
    }
  }

}

export default new StoreOwnerController();
import Good from '../models/Good';
import SupplierGoods from '../models/SuppliersGoods';
import { CreateGoodInput } from '../types/good.type';

class GoodsService {

  async getAllGoods() {
    return await Good.find();
  }

  async getGoodsBySupplier(supplierId: string) {
    return await SupplierGoods.find({ supplierId }).populate('goodId');
  }

  async createOrGetGood(data: CreateGoodInput) {
    let good = await Good.findOne({ name: data.name });
    if (!good) {
      good = await Good.create(data);
    }
    return good;
  }
  
}

export default new GoodsService();
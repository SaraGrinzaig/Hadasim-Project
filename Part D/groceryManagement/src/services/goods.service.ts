import Good from '../models/good';
import SupplierGoods from '../models/suppliers-goods';
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
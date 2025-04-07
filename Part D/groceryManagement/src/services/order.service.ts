import Order from '../models/Order';
import Good from '../models/Good';
import SupplierGoods from '../models/SuppliersGoods';

class OrderService {
  async createOrder(data: {
    supplierId: string;
    items: { goodId: string; quantity: number }[];
  }) {
    const { supplierId, items } = data;

    // if the suppluer has this goods
    const detailedItems = await Promise.all(items.map(async item => {
      const supplierGoods = await SupplierGoods.findOne({
        supplierId,
        goodId: item.goodId,
      });

      if (!supplierGoods) {
        throw new Error(`Supplier does not provide good with ID ${item.goodId}`);
      }

      const totalPrice = item.quantity * supplierGoods.pricePerUnit;

      return {
        goodId: item.goodId,
        quantity: item.quantity,
        pricePerUnit: supplierGoods.pricePerUnit,
        totalPrice,
      };
    }));

    const newOrder = await Order.create({
      supplierId,
      items: detailedItems,
      status: 'invited',
    });

    return newOrder;
  }

  async getAllOrders() {
    return await Order.find().populate('supplierId').populate('items.goodId');
  }

  async getOrdersBySupplier(supplierId: string) {
    return await Order.find({ supplierId }).populate('items.goodId');
  }

  async getOrdersByStatus(status: string) {
    return await Order.find({ status }).populate('items.goodId');
  }

  async updateOrderStatus(orderId: string, status: 'invited' | 'in process' | 'completed') {
    return await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  }
}

export default new OrderService();

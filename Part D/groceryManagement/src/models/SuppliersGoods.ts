import mongoose from 'mongoose';

const supplierGoodsSchema = new mongoose.Schema({
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  goodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Good', required: true },
  pricePerUnit: { type: Number, required: true },
  minOrderQuantity: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('SupplierGoods', supplierGoodsSchema);

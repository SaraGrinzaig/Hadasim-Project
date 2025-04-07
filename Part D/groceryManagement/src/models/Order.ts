import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  goodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Good', required: true },
  quantity: { type: Number, required: true },
  pricePerUnit: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: ['invited', 'in process', 'completed'],
    default: 'invited',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);

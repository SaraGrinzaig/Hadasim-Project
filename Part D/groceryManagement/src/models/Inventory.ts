import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  goodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Good', required: true },
  currentQuantity: { type: Number, required: true },
  minDesiredQuantity: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('Inventory', inventorySchema);
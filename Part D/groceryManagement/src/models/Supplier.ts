import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  representativeName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Supplier', supplierSchema);

import mongoose from 'mongoose';

const goodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
}, { timestamps: true });

export default mongoose.model('Good', goodSchema);
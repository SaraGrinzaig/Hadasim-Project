import mongoose, { Schema, Document } from 'mongoose';
import { IStoreOwner } from '../types/storeOwner.type';

const storeOwnerSchema = new Schema<IStoreOwner>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const StoreOwnerModel = mongoose.model<IStoreOwner>('StoreOwner', storeOwnerSchema);
export default StoreOwnerModel;
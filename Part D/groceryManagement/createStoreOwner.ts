import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import StoreOwnerModel from './src/models/store-owner';
import dotenv from 'dotenv';

dotenv.config();

async function createOwner() {
  await mongoose.connect(process.env.MONGO_URI!);

  const hashedPassword = await bcrypt.hash('123456', 10);

  const owner = await StoreOwnerModel.create({
    name: 'Avi Levi',
    email: 'avi@mystore.com',
    password: hashedPassword,
  });

  console.log('Store owner created:', owner);
  await mongoose.disconnect();
}

createOwner();

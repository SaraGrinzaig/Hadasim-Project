import Supplier from '../models/Supplier';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RegisterSupplierData } from '../types/supplier.type';
import Good from '../models/Good';
import SupplierGoods from '../models/SuppliersGoods';
import GoodsService from './goods.service';

class SupplierService {

  async registerSupplier(data: RegisterSupplierData) {
    const { companyName, phone, representativeName, email, password, goods } = data;

    const existing = await Supplier.findOne({ email });
    if (existing) {
      throw new Error('Supplier already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newSupplier = await Supplier.create({
      companyName,
      phone,
      representativeName,
      email,
      password: hashedPassword,
    });

    for (const goodData of goods) {
      const { name, description, pricePerUnit, minOrderQuantity } = goodData;

      const good = await GoodsService.createOrGetGood({ name, description });

      // Add to SuppliedGoods collection
      await SupplierGoods.create({
        supplierId: newSupplier._id,
        goodId: good._id,
        pricePerUnit,
        minOrderQuantity,
      });
    }

    const token = jwt.sign({ id: newSupplier._id }, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    });

    const { password: _, ...supplierWithoutPassword } = newSupplier.toObject();
    return { token, supplier: supplierWithoutPassword };

  }

  async loginSupplier(data: { email: string; password: string }) {
    const { email, password } = data;

    const supplier = await Supplier.findOne({ email }).select('+password');
    if (!supplier) {
      throw new Error('Supplier not found');
    }

    const isMatch = await bcrypt.compare(password, supplier.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: supplier._id }, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    });

    const { password: _, ...supplierWithoutPassword } = supplier.toObject();
    return { token, supplier: supplierWithoutPassword };

  }

  async getAllSuppliers() {
      return await Supplier.find();
    }
}

export default new SupplierService();

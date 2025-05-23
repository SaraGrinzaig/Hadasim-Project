import Supplier from '../models/supplier';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RegisterSupplierData } from '../types/supplier.type';
import SupplierGoods from '../models/suppliers-goods';
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

    const token = jwt.sign({ id: newSupplier._id, role: 'supplier' }, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    });

    const { password: _, ...supplierWithoutPassword } = newSupplier.toObject();
    return { token, supplier: supplierWithoutPassword };

  }

  async getAllSuppliers() {
      return await Supplier.find();
    }
}

export default new SupplierService();

import StoreOwner from '../models/store-owner';
import Supplier from '../models/supplier';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthService {

  async login(email: string, password: string) {

    // if the user is the  grocery owner
    const storeOwner = await StoreOwner.findOne({ email });
    if (storeOwner && await bcrypt.compare(password, storeOwner.password)) {
      const token = jwt.sign({ id: storeOwner._id, role: 'storeOwner' }, process.env.JWT_SECRET!, { expiresIn: '1d' });
      const { password: _, ...cleanOwner } = storeOwner.toObject();
      return { token, user: cleanOwner, role: 'storeOwner' };
    }

    // if the user is supplier
    const supplier = await Supplier.findOne({ email }).select('+password');
    if (supplier && await bcrypt.compare(password, supplier.password)) {
      const token = jwt.sign({ id: supplier._id, role: 'supplier' }, process.env.JWT_SECRET!, { expiresIn: '1d' });
      const { password: _, ...cleanSupplier } = supplier.toObject();
      return { token, user: cleanSupplier, role: 'supplier' };
    }

    throw new Error('Invalid credentials');
  }
}

export default new AuthService();

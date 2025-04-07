import StoreOwner from '../models/store-owner';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class StoreOwnerService {

    async login(data: { email: string; password: string }) {
      const { email, password } = data;
  
      const storeOwner = await StoreOwner.findOne({ email });
      if (!storeOwner) {
        throw new Error('Store owner not found');
      }
  
      const isMatch = await bcrypt.compare(password, storeOwner.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }
  
      const token = jwt.sign(
        { id: storeOwner._id, role: 'storeOwner' }, 
        process.env.JWT_SECRET as string,
        { expiresIn: '1d' }
      );
  
      const { password: _, ...ownerWithoutPassword } = storeOwner.toObject();
      return { token, owner: ownerWithoutPassword };
    }
}  

export default new StoreOwnerService();
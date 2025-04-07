import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import supplierRoutes from './routes/supplier.routes';
import goodsRoutes from './routes/goods.routes';
import orderRoutes from './routes/order.routes';
import storeOwnerRoutes from './routes/store-owner.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/suppliers', supplierRoutes);
app.use('/api/goods', goodsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/store-owner', storeOwnerRoutes);

app.get('/api/', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is up and running!' });
  });
  
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
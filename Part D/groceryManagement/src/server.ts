import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import supplierRoutes from './routes/supplier.routes';
import goodsRoutes from './routes/goods.routes';
import orderRoutes from './routes/order.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/suppliers', supplierRoutes);
app.use('/api/goods', goodsRoutes);
app.use('/api/orders', orderRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
import express from 'express';
import GoodsController from '../controllers/goods.controller';

const router = express.Router();

router.get('/', GoodsController.getAll);
router.get('/supplier/:supplierId', GoodsController.getBySupplier);

export default router;
import express from 'express';
import OrderController from '../controllers/order.controller';

const router = express.Router();

router.post('/', OrderController.create);
router.get('/', OrderController.getAll);
router.get('/supplier/:supplierId', OrderController.getBySupplier);
router.get('/status/:status', OrderController.getByStatus);
router.patch('/:orderId/status', OrderController.updateStatus);

export default router;
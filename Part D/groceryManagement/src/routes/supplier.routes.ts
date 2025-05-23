import express from 'express';
import SupplierController from '../controllers/supplier.controller';

const router = express.Router();

router.post('/signup', SupplierController.register);
router.get('/', SupplierController.getAll);

export default router;

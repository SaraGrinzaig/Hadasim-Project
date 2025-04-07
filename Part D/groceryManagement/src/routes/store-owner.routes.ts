import express from 'express';
import storeOwnerController from '../controllers/store-owner.controller';

const router = express.Router();

router.post('/login', storeOwnerController.login);

export default router;
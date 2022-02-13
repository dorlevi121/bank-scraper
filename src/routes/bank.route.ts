import express from 'express';
import { addBankAccount } from '../controllers/bank.controller';
import { verifyRole, verifyToken } from '../middlewares/auth.middleware';
import { Roles } from '../models/enums/roles.enum';
const router = express.Router();

router.put('/account', verifyToken, verifyRole(Roles.member), addBankAccount);

export default router;
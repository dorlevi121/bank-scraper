import express from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgotpassword',);
router.post('/resetpassword',);

export default router;
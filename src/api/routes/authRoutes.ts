import express from 'express';
import { loginUserAccount, registNewUser } from '../controllers/authControllers';

const router = express.Router();

router.post('/register', registNewUser);
router.post('/login', loginUserAccount);

export default router;
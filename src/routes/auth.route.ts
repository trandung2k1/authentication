import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import AuthController from '../controller/auth.controller';
const router = Router();
router.post('/login', AuthController.login);
router.get('/profile', authenticate, AuthController.profile);
router.post('/register', AuthController.register);

export default router;

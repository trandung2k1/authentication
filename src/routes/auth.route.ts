import { Router, Request, Response, NextFunction } from 'express';
import { ISession } from '../types/session';
import { authenticate } from '../middlewares/auth.middleware';
const router = Router();
router.post('/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    (req.session as ISession).clientId = 'abc123';
    (req.session as ISession).myNum = 5;
    return res.status(200).json({
        message: 'You are logged in',
    });
});
router.get('/profile', authenticate, (req: Request, res: Response) => {
    return res.json(req.session);
});
router.post('/register', (req: Request, res: Response) => {
    throw new Error('Register failed');
});

export default router;

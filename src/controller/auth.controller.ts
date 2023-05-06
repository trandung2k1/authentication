import { Request, Response } from 'express';
import { ISession } from '../types/session';
import AuthService from '../service/auth.service';
class AuthController {
    static async login(req: Request, res: Response) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password is required',
            });
        }
        try {
            const data = await AuthService.login({ email, password });
            return res.status(200).json(data);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json(error.message);
            }
        }
        // (req.session as ISession).clientId = 'abc123';
        // (req.session as ISession).myNum = 5;
        // return res.status(200).json({
        //     message: 'You are logged in',
        // });
    }
    static profile(req: Request, res: Response) {
        return res.json(req.session);
    }
    static register(req: Request, res: Response) {
        throw new Error('Register failed');
    }
}

export default AuthController;

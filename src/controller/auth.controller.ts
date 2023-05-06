import { Request, Response } from 'express';
import { ISession } from '../types/session';
import AuthService from '../service/auth.service';
class AuthController {
    static async register(req: Request, res: Response) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Email and password is required',
            });
        }
        try {
            const rs = await AuthService.register({ email, password });
            return res.status(rs?.statusCode!).json(rs);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    statusCode: 500,
                    data: 'Email already exists',
                });
            }
        }
        // (req.session as ISession).clientId = 'abc123';
        // (req.session as ISession).myNum = 5;
        // return res.status(200).json({
        //     message: 'You are logged in',
        // });
    }
    static async login(req: Request, res: Response) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password is required',
            });
        }
        try {
            const rs = await AuthService.login({ email, password });
            (req.session as ISession).user = rs?.data;
            return res.status(rs?.statusCode!).json(rs);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json(error.message);
            }
        }
    }
    static profile(req: Request, res: Response) {
        return res.json(req.session);
    }
}

export default AuthController;

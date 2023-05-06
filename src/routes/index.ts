import { Express, Request, Response } from 'express';
import auth from './auth.route';
const routes = (app: Express) => {
    app.use('/api/auth', auth);
    app.post('/login', (req: Request, res: Response) => {
        const refreshToken: string = 'Refresh token';
        // res.cookie('refreshToken', refreshToken, {
        //     httpOnly: true,
        //     path: '/',
        //     secure: false,
        //     sameSite: 'strict',
        //     expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        // });
        return res.status(200).json({
            message: 'Login successfully',
        });
    });
    app.get('/getCookie', (req: Request, res: Response) => {
        const refreshToken: string = req.cookies.refreshToken;
        if (refreshToken) {
            return res.status(200).json({
                refreshToken,
            });
        }
        return res.status(404).json({
            message: 'Refresh token not found',
        });
    });
    app.post('/refresh', (req: Request, res: Response) => {
        if (req.cookies.refreshToken) {
            return res.status(200).json({
                message: 'Refresh token',
            });
        } else {
            return res.status(401).json({
                message: 'You not logged in',
            });
        }
    });
    app.post('/logout', (req: Request, res: Response) => {
        res.clearCookie('refreshToken');
        return res.status(200).json({
            message: 'Logout successfully',
        });
    });
};

export default routes;

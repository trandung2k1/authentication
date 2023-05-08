import { Express, Request, Response } from 'express';
import auth from './auth.route';
import jwt from 'jsonwebtoken';
const routes = (app: Express) => {
    app.use('/api/auth', auth);
    app.post('/login', (req: Request, res: Response) => {
        const refreshToken: string = 'Refresh token';
        const accessToken: string = jwt.sign({ id: 1 }, 'mySecret', {
            expiresIn: '60s',
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            path: '/',
            secure: false,
            sameSite: 'strict',
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
        return res.status(200).json({
            message: 'Login successfully',
            accessToken,
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
    app.get('/data', (req, res) => {
        const { accessToken } = req.body;
        // console.log(accessToken);
        jwt.verify(accessToken, 'mySecret', (err: any, decoded: any) => {
            if (err?.name === 'TokenExpiredError') {
                return res.status(400).json({
                    message: 'Jwt expired',
                });
            }
            if (err?.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    message: err.message,
                });
            }
            if (decoded.id === 1) {
                return res.status(200).json({
                    message: 'Hello',
                });
            }
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
    app.get('/logout', (req: Request, res: Response) => {
        res.clearCookie('refreshToken');
        return res.status(200).json({
            message: 'Logout successfully',
        });
    });
};

export default routes;

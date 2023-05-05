import express, { Express, Request, Response } from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();
const RedisStore = require('connect-redis').default;
import { createClient } from 'redis';
const cookieParser = require('cookie-parser');
import helmet from 'helmet';
import { errorHandler, notFound } from './utils/errorHandler';
import routes from './routes';
import connectDB from './config/db';
const port: number = 4000;
const redisClient = createClient();
redisClient.on('error', (err): void => {
    console.log(err);
    console.log('Redis Client Error');
    process.exit(1);
});
redisClient.on('connect', (): void => {
    console.log('Redis plugged in.');
});
(async (): Promise<void> => {
    await redisClient.connect();
})();
const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'app:',
});
const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(
    session({
        store: redisStore,
        resave: false,
        saveUninitialized: false,
        secret: 'key secret',
        name: 'sessionId',
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 1000 * 60 * 30,
        },
    }),
);

//example cookies
app.use(cookieParser());
app.post('/login', (req: Request, res: Response) => {
    const refreshToken: string = 'Refresh token';
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        path: '/',
        secure: false,
        sameSite: 'strict',
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
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

app.get('/', (req: Request, res: Response) => {
    return res.status(200).json({
        message: 'Welcome to the server 👋👋',
    });
});
routes(app);
app.use(notFound);
app.use(errorHandler);
app.listen(port, async (): Promise<void> => {
    await connectDB();
    console.log(`Server listening on http://localhost:${port}`);
}).on('error', (e: Error) => {
    console.log(e);
    process.exit(1);
});

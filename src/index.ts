import express, { Express, NextFunction, Request, Response } from 'express';
import session, { Session } from 'express-session';
const RedisStore = require('connect-redis').default;
import { createClient } from 'redis';
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
(async () => {
    await redisClient.connect();
})();
const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'app:',
});
const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        store: redisStore,
        resave: false,
        saveUninitialized: false,
        secret: 'key secret',
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 1000 * 60 * 30,
        },
    }),
);
app.get('/', (req: Request, res: Response) => {
    return res.status(200).json({
        message: 'Hi',
    });
});
interface ISession extends Session {
    clientId?: string;
    myNum?: number;
}
//
app.post('/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    (req.session as ISession).clientId = 'abc123';
    (req.session as ISession).myNum = 5;
    return res.status(200).json({
        message: 'You are logged in',
    });
});

//
class IError extends Error {
    constructor(public message: string, public statusCode?: number) {
        super(message);
        this.statusCode = statusCode;
        // Object.setPrototypeOf(this, new.target.prototype);
    }
}
app.use((req: Request, res: Response, next: NextFunction) => {
    const request = req.session as ISession;
    if (!request || !request.clientId) {
        const err: IError = new IError('You shall not pass');
        err.statusCode = 401;
        next(err);
    }
    next();
});

app.get('/profile', (req: Request, res: Response) => {
    return res.json(req.session);
});
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
}).on('error', (e: Error) => {
    console.log(e);
    process.exit(1);
});

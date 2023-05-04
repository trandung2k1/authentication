import express, { Express, Request, Response } from 'express';
import session from 'express-session';
const RedisStore = require('connect-redis').default;
import { createClient } from 'redis';
import { errorHandler, notFound } from './utils/errorHandler';
import routes from './routes';
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
app.get('/', (req: Request, res: Response) => {
    return res.status(200).json({
        message: 'Welcome to the server 👋👋',
    });
});
routes(app);
app.use(notFound);
app.use(errorHandler);
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
}).on('error', (e: Error) => {
    console.log(e);
    process.exit(1);
});

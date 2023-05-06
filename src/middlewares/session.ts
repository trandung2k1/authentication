import session from 'express-session';
import redisClient from '../db/redis';
const RedisStore = require('connect-redis').default;
const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'app:',
});
const sessionMiddleware = session({
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
});
export default sessionMiddleware;

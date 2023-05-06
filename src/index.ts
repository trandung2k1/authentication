import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
const cookieParser = require('cookie-parser');
import helmet from 'helmet';
import colors from 'colors';
import cors from 'cors';
import { errorHandler, notFound } from './middlewares/errorHandler';
import routes from './routes';
import connectDB from './db/mongodb';
import sessionMiddleware from './middlewares/session';
import corsOptions from './middlewares/cors.middleware';
const port: number = 4000;
const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(helmet());
app.use(sessionMiddleware);
app.use(cookieParser());
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
    console.log(colors.green(`Server listening on http://localhost:${port}`));
}).on('error', (e: Error) => {
    console.log(e);
    process.exit(1);
});

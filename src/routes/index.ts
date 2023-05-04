import { Express } from 'express';
import auth from './auth.route';
const routes = (app: Express) => {
    app.use('/api/auth', auth);
};

export default routes;

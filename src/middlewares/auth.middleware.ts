import { Response, Request, NextFunction } from 'express';
import { ISession } from '../types/session';
import { IError } from '../exception/error';
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const request = req.session as ISession;
    if (!request || !request.clientId) {
        const error: IError = new IError("You're not allowed to do that.");
        error.statusCode = 401;
        next(error);
    }
    next();
};

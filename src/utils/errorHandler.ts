import { Response, Request, NextFunction } from 'express';
import { IError } from '../exception/error';
export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error: IError = new IError(`Route not found: ${req.originalUrl}`);
    error.statusCode = 404;
    res.status(404);
    next(error);
};
export const errorHandler = (error: IError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
    res.status(statusCode);
    return res.json({
        status: error?.statusCode,
        message: error?.message,
    });
};

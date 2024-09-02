import {NextFunction, Request, Response} from 'express';
const checkForBufferData = (req: Request, res: Response, next: NextFunction) => {
    if (Buffer.isBuffer(req.body)) {
        req.body = JSON.parse(req.body.toString('utf-8'));
        next();
    }
    next()
}

export {checkForBufferData};
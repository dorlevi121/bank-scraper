import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { errorMessage } from '../models/enums/error-message.enum';
import { Roles } from '../models/enums/roles.enum';
import { responseBuilder } from '../utils/response-builder.utils';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const bearerHeader = req.headers["authorization"];
    if (!bearerHeader) {
        const responsData = {
            error: true,
            message: errorMessage.noAccessPermission,
            status: 403
        }
        return res.status(403).json(responseBuilder(responsData));
    }


    const bearer = bearerHeader.split(' ');
    const token = bearer[1];

    if (!token) {
        const responsData = {
            error: true,
            message: errorMessage.noAccessPermission,
            status: 403
        }
        return res.status(403).json(responseBuilder(responsData));
    }

    try {
        const decoded: any = jwt.verify(token, process.env.TOKEN_KEY || '');
        if (req.tokenData)
            req.tokenData = decoded;

    } catch (err) {
        const responsData = {
            error: true,
            message: errorMessage.noAccessPermission,
            status: 401
        }
        return res.status(401).json(responseBuilder(responsData));
    }
    return next();
};

export const verifyRole = (role: typeof Roles) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req?.tokenData?.userType !== role) {
            const responsData = {
                error: true,
                message: errorMessage.noAccessPermission,
                status: 403
            }
            return res.status(403).json(responseBuilder(responsData));
        }

        next();
    }
}
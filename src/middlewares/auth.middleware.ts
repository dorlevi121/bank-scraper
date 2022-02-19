import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { errorMessage } from '../utils/error-message.enum';
import { Roles } from '../models/enums/roles.enum';
import { responseBuilder } from '../utils/response-builder.utils';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const responsData = {
        error: true,
        message: errorMessage.noAccessPermission,
        status: 401
    }

    const bearerHeader = req.headers["authorization"];
    if (!bearerHeader) {
        return res.status(401).json(responseBuilder(responsData));
    }

    const token = bearerHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json(responseBuilder(responsData));
    }

    try {  
        const decoded: any = jwt.verify(token, process.env.TOKEN_KEY || '');
        
        if (decoded)
            req.tokenData = decoded;

    } catch (err) {        
        return res.status(401).json(responseBuilder(responsData));
    }
    return next();
};

export const verifyRole = (role: Roles) => {
    return (req: Request, res: Response, next: NextFunction) => {
        
        if (req?.tokenData?.userType !== role) {
            const responsData = {
                error: true,
                message: errorMessage.noAccessPermission,
                status: 401
            }
            return res.status(401).json(responseBuilder(responsData));
        }

        next();
    }
}
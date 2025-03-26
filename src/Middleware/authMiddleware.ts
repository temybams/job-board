import { Response, NextFunction } from 'express';
import { RequestWithUser } from '../types/requestTypes';
import httpStatus from 'http-status';
import User from '../Model/UserModel';
import JWTService from '../Utils/JWTGenerator';
import throwError from '../types/error';
import catchAsync from './catchAsync';

const authMiddleware = catchAsync(
    async (req:RequestWithUser, res: Response, next: NextFunction) => {

        let token: string | undefined;
        let type: string | undefined;
        [type, token] = req.headers.authorization?.split(' ') ?? [];

        if (type !== 'Bearer' || !token) {
            return throwError('Unauthorized', httpStatus.UNAUTHORIZED);
        }

        const decoded = JWTService.verify(token) as { sub: string, role: string  };

        if (!decoded) {
            return throwError('Unauthorized', httpStatus.UNAUTHORIZED);
        }

        const user = await User.findById(decoded.sub);

        if (!user) {
            return throwError('Unauthorized', httpStatus.UNAUTHORIZED);
        }

        req.user = user;

        next();
    }
);

export default authMiddleware;

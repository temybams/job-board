import { Request, Response, NextFunction, RequestHandler } from "express";
import { RequestWithUser } from "../types/requestTypes";
import httpStatus from "http-status";

// User authorization handler with roles
const userAuthorizationHandler = (...roles: string[]): RequestHandler => {
    return (req: RequestWithUser, res: Response, next: NextFunction): void => {

        const userRole = req.user?.role;

        if (!userRole || !roles.includes(userRole)) {
            res.status(httpStatus.FORBIDDEN).json({
                status: false,
                message: "You don't have permission",
            });

            return;
        }

        next(); 
    };
}


export default userAuthorizationHandler;

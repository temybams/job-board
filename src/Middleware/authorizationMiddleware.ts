import { Request, Response, NextFunction, RequestHandler } from "express";
import { RequestWithUser } from "../types/requestTypes";
import httpStatus from "http-status";

// User authorization handler with roles
const userAuthorizationHandler = (...roles: string[]): RequestHandler => {
    return (req: RequestWithUser, res: Response, next: NextFunction): void => {
        // Ensure the user object exists and contains the role
        const userRole = req.user?.role;

        if (!userRole || !roles.includes(userRole)) {
            // Send response directly, not returning it
            res.status(httpStatus.FORBIDDEN).json({
                status: false,
                message: "You don't have permission",
            });

        next(); // Proceed if the user has a valid role
    };
}
}

export default userAuthorizationHandler;

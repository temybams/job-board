import { Request, Response, NextFunction } from 'express'

const catchAsync = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch((error) => next(error))
    }
}

export default catchAsync

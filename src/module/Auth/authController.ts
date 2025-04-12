import { Request, Response } from 'express'
import { RequestWithUser } from '../../types/requestTypes'
import catchAsync from '../../Middleware/catchAsync'
import authServices from './authServices'
import throwError from '../../types/error'
import httpStatus from 'http-status';

const authController = {

    addUser: catchAsync(async (req: Request, res: Response) => {
        const user = await authServices.addUserService(req.body)
        res.status(201).json({
            success: true,
            data: user,
        })
    }),

    login: catchAsync(async (req: Request, res: Response) => {
        const token = await authServices.loginService(req.body.email, req.body.password)
        res.status(200).json({
            success: true,
            data: token,
        })

    }),

    getMe: catchAsync(async (req: RequestWithUser, res: Response) => {
        const user = await authServices.getMeService(req.user!._id.toString())
        res.status(200).json({
            success: true,
            data: user,
        })
    }),

    getAllUsers: catchAsync(async (req: RequestWithUser, res: Response) => {
        const users = await authServices.getAllUsersService()
        res.status(200).json({
            success: true,
            data: users,
        })
    }),

    updateUser: catchAsync(async (req: RequestWithUser, res: Response) => {
        const user = await authServices.updateUserService(req.params.id, req.body)
        res.status(200).json({
            success: true,
            data: user,
        })
    }),


    deleteUser: catchAsync(async (req: RequestWithUser, res: Response) => {
        const { id } = req.params;
        const result = await authServices.deleteUserService(id);
        res.status(200).json({
            success: true,
            message: result.message,
        });
    }),

    deleteAllUsers: catchAsync(async (req: RequestWithUser, res: Response) => {
        const result = await authServices.deleteAllUsersService();
        res.status(200).json({
            success: true,
            message: result.message,
        });
    }),
    
    


}

export default authController

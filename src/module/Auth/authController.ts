import { Request, Response } from 'express'
import catchAsync from '../../Middleware/catchAsync'
import authServices from './authServices'
import throwError from '../../types/error'
import { create } from 'lodash'

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

    })


}

export default authController

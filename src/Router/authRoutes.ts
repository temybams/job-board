import express from 'express'
import authController from '../module/Auth/authController'
import authMiddleware from '../Middleware/authMiddleware'
import validationMiddleware from '../Middleware/validationMiddleware'
import { userRegisterSchema, userLoginSchema } from '../Validation/userRegistration'

const AuthRouter = express.Router()

AuthRouter.get('/me', authMiddleware, authController.getMe)
AuthRouter.post('/register', validationMiddleware(userRegisterSchema), authController.addUser)
AuthRouter.post('/login', validationMiddleware(userLoginSchema), authController.login)




export default AuthRouter
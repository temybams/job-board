import express from 'express'
import authController from '../module/Auth/authController'
import authMiddleware from '../Middleware/authMiddleware'
import validationMiddleware from '../Middleware/validationMiddleware'
import { userRegisterSchema, userLoginSchema } from '../Validation/userRegistration'

const router = express.Router()

router.post('/register', validationMiddleware(userRegisterSchema), authController.addUser)
router.post('/login', validationMiddleware(userLoginSchema), authController.login)

export default router
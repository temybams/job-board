import { Router } from 'express'
import authController from '../module/Auth/authController'
import authMiddleware from '../Middleware/authMiddleware'
import userAuthorizationHandler from '../Middleware/authorizationMiddleware'
import { UserRole } from '../Model/UserModel'

const UserRouter = Router()


UserRouter.get('/all', userAuthorizationHandler(UserRole.ADMIN), authController.getAllUsers)
UserRouter.patch('/update/:id', authController.updateUser)
UserRouter.delete("/delete/all", authController.deleteAllUsers);
UserRouter.delete("/:id", authController.deleteUser);


export default UserRouter
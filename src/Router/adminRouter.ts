import express from 'express';
import AdminController from '../module/Admin/adminController';
import userAuthorizationHandler from '../Middleware/authorizationMiddleware';


const AdminRouter = express.Router();

AdminRouter.get(  "/info",userAuthorizationHandler("admin"),AdminController.getAllInfo);

AdminRouter.get( "/stats",userAuthorizationHandler("admin"),AdminController.monthlyInfo);

AdminRouter.patch("/update-role",userAuthorizationHandler("admin"), AdminController.updateUserRole);

export default AdminRouter;
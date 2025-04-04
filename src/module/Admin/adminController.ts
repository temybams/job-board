import { Response, NextFunction } from "express";
import { RequestWithUser } from "../../types/requestTypes";
import createError from "http-errors";
import catchAsync from "../../Middleware/catchAsync";
import AdminService from "../Admin/adminService";

const AdminController = {

    getAllInfo: catchAsync(async (req: RequestWithUser, res: Response) => {
        const result = await AdminService.getAllInfo();
        res.status(200).json({
            success: true,
            status: "success",
            data: result,
        });
    }),

    monthlyInfo: catchAsync(async (req: RequestWithUser, res: Response) => {
        const result = await AdminService.monthlyInfo();
        res.status(200).json({
            success: true,
            status: "success",
            result,
        });
    }),

    updateUserRole: catchAsync(async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { role } = req.body;
        const adminId = req.user!.id;


        const updatedUser = await AdminService.updateUserRole(adminId, id, role);

        res.status(200).json({
            success: true,
            status: "success",
            data: updatedUser,
        });
    }),
}


export default AdminController;
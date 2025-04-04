import { Response } from "express";
import { RequestWithUser } from "../../types/requestTypes";
import jobServices from "./jobServices";
import catchAsync from "../../Middleware/catchAsync";


const jobController = {
    getAllJobs: catchAsync(async (req: RequestWithUser, res: Response) => {
        const jobs = await jobServices.getAllJobs(req.query);
        res.status(200).json({
            success: true,
            status: "success",
            data: jobs,
        });
    }),

    addJob: catchAsync(async (req: RequestWithUser, res: Response) => {

        const userId = req.user!._id.toString();

        const job = await jobServices.addJob(req.body, userId);
        res.status(201).json({
            success: true,
            status: "success",
            data: job,
        });
    }
    ),

    getMyJobs: catchAsync(async (req: RequestWithUser, res: Response) => {


        const jobs = await jobServices.getMyJobs(req.user!._id.toString());

        res.status(200).json({
            success: true,
            status: "success",
            data: jobs,
        });
    }),

    getSingleJob: catchAsync(async (req: RequestWithUser, res: Response) => {
        const { id } = req.params;
        const job = await jobServices.getSingleJob(id);

        res.status(200).json({
            success: true,
            status: "success",
            data: job,
        });
    }),

    updateSingleJob: catchAsync(async (req: RequestWithUser, res: Response) => {
        const { id } = req.params;
        const job = await jobServices.updateSingleJob(id, req.body);

        res.status(200).json({
            success: true,
            status: "success",
            data: job,
        });
    }),

    deleteSingleJob: catchAsync(async (req: RequestWithUser, res: Response) => {
        const { id } = req.params;
        const job = await jobServices.deleteSingleJob(id);

        res.status(200).json({
            success: true,
            message: "Job Deleted"

        });
    }),

    deleteAllJobs: catchAsync(async (req: RequestWithUser, res: Response) => {
        const jobs = await jobServices.deleteAllJobs();

        res.status(200).json({
            success: true,
            status: "success",
            data: jobs,
        });
    }),

}


export default jobController;



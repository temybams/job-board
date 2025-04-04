import { RequestWithUser } from "../../types/requestTypes";
import { Response } from "express";
import applicationService from "./applicationService";
import catchAsync from "../../Middleware/catchAsync";


const applicationController = {

    getCandidateAppliedJobs: catchAsync(async (req: RequestWithUser, res: Response) => {
        const { result, totalJobs, pageCount, page } = await applicationService.getCandidateAppliedJobs( req.query, req.user!._id.toString());

        res.status(200).json({
            success: true,
            status: "success",
            result,
            totalJobs,
            currentPage: page,
            pageCount,
        });
    }),

    getRecruiterPostJobs: catchAsync(async (req: RequestWithUser, res: Response) => {
        const { result, totalJobs } = await applicationService.getRecruiterPostJobs(req.user!._id.toString());

        res.status(200).json({
            success: true,
            status: "success",
            totalJobs,
            result,
        });
    }),

    applyForJob: catchAsync(async (req: RequestWithUser, res: Response) => {
        const application = await applicationService.applyForJob(req.body, req.user!._id.toString());
        res.status(201).json({
            success: true,
            status: "success",
            data: application,
        });
    }),

    updateJobStatus: catchAsync(async (req: RequestWithUser, res: Response) => {
        const { id } = req.params;
        const updatedJob = await applicationService.updateJobStatus(id, req.body, req.user!._id.toString());
        res.status(200).json({
            success: true,
            status: "success",
            data: updatedJob,
        });
    })
}


export default applicationController;
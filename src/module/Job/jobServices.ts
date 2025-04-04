import httpStatus from 'http-status';
import Job, { IJob } from '../../Model/JobModel';
import { jobSchema } from '../../Validation/jobValidation';
import throwError from "../../types/error";
import mongoose from 'mongoose';
import {getData} from '../../Utils/helperFunction';




const jobServices = {

    getAllJobs: async (query: any) => {

        const filters = { ...query };

        // Fields to exclude from filters as they are for pagination/sorting
        const excludeFields = ["sort", "page", "limit", "fields", "search"];
        excludeFields.forEach((field) => delete filters[field]);

        const queries: Record<string, any> = {};

        // Sorting logic
        if (query.sort) {
            queries.sortBy = query.sort.split(",").join(" ");
        }

        // Field selection logic
        if (query.fields) {
            queries.fields = query.fields.split(",").join(" ");
        }

        // Pagination logic
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 5;
        const skip = (page - 1) * limit;

        queries.skip = skip;
        queries.limit = limit;
        queries.page = page;

        // Search logic
        if (query.search) {
            const searchQuery = query.search;
            filters.$or = [
                { company: { $regex: new RegExp(`.*${searchQuery}.*`, "i") } },
                { position: { $regex: new RegExp(`.*${searchQuery}.*`, "i") } },
                { jobStatus: { $regex: new RegExp(`.*${searchQuery}.*`, "i") } },
                { jobType: { $regex: new RegExp(`.*${searchQuery}.*`, "i") } },
                { jobLocation: { $regex: new RegExp(`.*${searchQuery}.*`, "i") } }
            ];
        }

        // Get Data using helper function
        const { result, totalJobs, pageCount, page: currentPage } = await getData(filters, queries);


        if (!result.length) throwError('Job List is empty', httpStatus.NOT_FOUND);

        return { result, totalJobs, pageCount, currentPage };
    },


    addJob: async (jobData: IJob, userId: string) => {
        const validatedData = jobSchema.parse(jobData);

        const finalData = {
            ...validatedData,
            createdBy: userId,
        };

        const isJobExists = await Job.findOne({
            company: validatedData.company,
        });

        if (isJobExists) {
            throwError("Job data already exists", httpStatus.CONFLICT);
        }



        const newJob = await Job.create(finalData);


        return newJob;
    },

    getMyJobs: async (userId: string) => {
        const jobs = await Job.find({ createdBy: userId });

        return jobs;
    },

    getSingleJob: async (jobId: string) => {

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            throwError("Invalid Job ID", httpStatus.BAD_REQUEST);
        }
        const job = await Job.findById(jobId );

        if (!job) {
            throwError("Job not found", httpStatus.NOT_FOUND);
        }

        return job;
    },

    updateSingleJob: async (jobId: string, jobData: IJob) => {
        const job = await Job.findOneAndUpdate(
            { _id: jobId },
            jobData,
            { new: true, runValidators: true }
        );

        if (!job) throwError("Job not found", httpStatus.NOT_FOUND);;
        return job;
    },

    deleteSingleJob: async (jobId: string) => {

        const deletedJob = await Job.findByIdAndDelete(jobId);

        if (!deletedJob) throwError("Job not found", httpStatus.NOT_FOUND);

        return deletedJob;
    },

    deleteAllJobs: async () => {

        const deletedJobs = await Job.deleteMany({});

        if (!deletedJobs) throwError("No Jobs found", httpStatus.NOT_FOUND);

        return { message: 'All jobs deleted successfully', deletedCount: deletedJobs.deletedCount };
    }



}

export default jobServices;


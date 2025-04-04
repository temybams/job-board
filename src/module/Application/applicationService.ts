import Application, { IApplication } from "../../Model/ApplicationModel"
import throwError from "../../types/error"
import { applicationSchema } from "../../Validation/applicationValidation"
import { QueryParams, getData, getDataApplication } from "../../Utils/helperFunction"
import httpStatus from "http-status"
import mongoose from "mongoose"
import Job from "../../Model/JobModel"
import { STATUS } from "../../Utils/ApplicationConstants"


const ApplicationService = {
    getCandidateAppliedJobs: async (query: QueryParams, userId: string) => {
        const parsedQuery = typeof query === "string" ? JSON.parse(query) : query;

        // Ensure filters are applied correctly
        const filters = { ...parsedQuery, applicantId: userId };
        const excludeFields = ["sort", "page", "limit", "fields", "search"];
        excludeFields.forEach((field) => delete filters[field]);

        const queries: any = {};

        // Handle sorting
        if (parsedQuery.sort) queries.sortBy = parsedQuery.sort.split(",").join(" ");
        if (parsedQuery.fields) queries.fields = parsedQuery.fields.split(",").join(" ");

        // Handle pagination
        queries.limit = parsedQuery.limit ? Number(parsedQuery.limit) : 10; // Default to 10
        queries.page = parsedQuery.page ? Number(parsedQuery.page) : 1;
        queries.skip = (queries.page - 1) * queries.limit;

        
        const { result, totalJobs, pageCount, page } = await getDataApplication(filters, queries);

        if (!result.length) throw new Error("Job List is empty");

        return { result, totalJobs, pageCount, page };
    },


    getRecruiterPostJobs: async (userId: string) => {
        const filter = { recruiterId: userId };
        const result = await Application.find(filter).populate("jobId");
        const totalJobs = await Application.countDocuments(filter);


        if (!result.length) throwError("No Job Found", httpStatus.NOT_FOUND);

        return { result, totalJobs };
    },

    applyForJob: async (data: IApplication, applicantId: string) => {
        // Ensure applicantId is set correctly
        if (!applicantId) {
            throwError("Applicant ID is required", httpStatus.BAD_REQUEST);
        }

        const alreadyApplied = await Application.findOne({
            applicantId, // Now using the correct applicantId from token
            jobId: data.jobId,
        });

        if (alreadyApplied) throwError("Already Applied", httpStatus.CONFLICT);

        // 2. Fetch the job details to get the recruiterId
        const job = await Job.findById(data.jobId);
        if (!job) throwError("Job not found", httpStatus.NOT_FOUND);

        // 3. Set up the auto-generated fields
        const newApplicationData = {
            ...data,
            applicantId, // Ensure applicantId is set from token
            status: STATUS.PENDING, // Default status
            recruiterId: job!.createdBy, // Get recruiterId from the job's createdBy field
            dateOfApplication: new Date(), // Set current date as dateOfApplication
            dateOfJoining: data.dateOfJoining || undefined, // If provided, use it; otherwise, leave undefined
        };

        // 4. Create and save the application
        const newApplication = new Application(newApplicationData);
        await newApplication.save();

        return newApplication;
    },

    updateJobStatus: async (id: string, data: IApplication, userId: string) => {
        if (data?.recruiterId?.toString() !== userId.toString()) {
            throwError("Unauthorized user to update job", httpStatus.UNAUTHORIZED);
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throwError("Invalid Job ID format", httpStatus.BAD_REQUEST);
        }

        const isJobExists = await Application.findById(id);
        if (!isJobExists) throwError("Job not found", httpStatus.NOT_FOUND);

        const updatedJob = await Application.findByIdAndUpdate(id, { $set: data }, { new: true });

        return updatedJob;
    }
}
export default ApplicationService;
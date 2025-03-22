import { z } from 'zod';
import { STATUS } from "../Utils/ApplicationConstants";
import { Types } from 'mongoose';


const applicationSchema = z.object({
    applicantId: z
        .string()
        .refine(value => Types.ObjectId.isValid(value), {
            message: "Invalid Applicant ID",
        }),
    recruiterId: z
        .string()
        .refine(value => Types.ObjectId.isValid(value), {
            message: "Invalid Recruiter ID",
        }),
    jobId: z
        .string()
        .refine(value => Types.ObjectId.isValid(value), {
            message: "Invalid Job ID",
        }),
    status: z.enum([STATUS.PENDING, STATUS.ACCEPTED, STATUS.REJECTED]),
    dateOfApplication: z
        .string()
        .refine(value => !isNaN(Date.parse(value)), {
            message: "Invalid Date",
        }),
    resume: z.string().url("Invalid URL for resume"),
});

export { applicationSchema };

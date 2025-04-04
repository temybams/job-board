import { z } from 'zod';
import { STATUS } from "../Utils/ApplicationConstants";
import mongoose from "mongoose";


const applicationSchema = z.object({

    jobId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid Job ID",
    }),
    resume: z.string().nonempty({ message: "Resume URL is required" }),
    dateOfApplication: z
        .optional(z.coerce.date())  // Automatically convert string to Date
        .refine((val) => !val || val <= new Date(), {
            message: "dateOfApplication should be less than or equal to current date",
        }),
});

export { applicationSchema };

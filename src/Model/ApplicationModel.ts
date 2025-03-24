import mongoose, { Document, Schema } from "mongoose";
import { STATUS } from "../Utils/ApplicationConstants";

// Define the interface for the Application Document
interface IApplication extends Document {
    applicantId: mongoose.Types.ObjectId;
    recruiterId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
    status: string;
    resume: string;
    dateOfApplication: Date;
    dateOfJoining?: Date;  
}

// Define the Application Schema
const ApplicationSchema = new Schema<IApplication>(
    {
        applicantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recruiterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(STATUS),
            default: STATUS.PENDING,
            required: true,
        },
        resume: {
            type: String,
            required: true,
        },
        dateOfApplication: {
            type: Date,
            default: Date.now,
        },
        dateOfJoining: {
            type: Date,
            validate: {
                validator: function (this: IApplication, value: Date) {
                    return this.dateOfApplication <= value;
                },
                message: "dateOfJoining should be greater than dateOfApplication",
            },
        },
    },
    { timestamps: true }
);

// Define the Application Model
const Application = mongoose.model<IApplication>("Application", ApplicationSchema);
export default Application;

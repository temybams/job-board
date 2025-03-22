import mongoose, { Document, Schema } from "mongoose";
import { JOB_STATUS, JOB_TYPE } from "../Utils/JobConstants";

// Define the interface for the Job Document
interface IJob extends Document {
    company: string;
    position: string;
    jobStatus: string;
    jobType: string;
    jobLocation: string;
    createdBy: mongoose.Types.ObjectId;
    jobVacancy: string;
    jobSalary: string;
    jobDeadline: string;
    jobDescription: string;
    jobSkills: string[];
    jobFacilities: string[];
    jobContact: string;
}

// Define the Job Schema
const JobSchema = new Schema<IJob>(
    {
        company: {
            type: String,
            required: [true, "A Company name is required"],  // Corrected 'requried' to 'required'
            trim: true,
            minLength: [5, "Company name is too short"],
            maxLength: [100, "Company name is too long"],
        },
        position: {
            type: String,
            required: [true, "Job must have a Position"],  // Corrected 'requried' to 'required'
            trim: true,
            minLength: [5, "Company name is too short"],
            maxLength: [200, "Company name is too long"],
        },
        jobStatus: {
            type: String,
            enum: Object.values(JOB_STATUS),
            default: JOB_STATUS.PENDING,
        },
        jobType: {
            type: String,
            enum: Object.values(JOB_TYPE),
            default: JOB_TYPE.FULL_TIME,
        },
        jobLocation: {
            type: String,
            required: [true, "Job must have a location"],
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        jobVacancy: {
            type: String,
            required: [true, "Job Vacancy is required"],  
            trim: true,
        },
        jobSalary: {
            type: String,
            required: [true, "Job Salary is required"],  
            trim: true,
        },
        jobDeadline: {
            type: String,
            required: [true, "Job Deadline is required"],  
            trim: true,
        },
        jobDescription: {
            type: String,
            required: [true, "Job Description is required"],
            trim: true,
        },
        jobSkills: {
            type: [String],
            required: [true, "Job Skills are required"],  
            trim: true,
        },
        jobFacilities: {
            type: [String],
            required: [true, "Job facilities are required"],  
            trim: true,
        },
        jobContact: {
            type: String,
            required: [true, "Job contact is required"], 
            trim: true,
        },
    },
    { timestamps: true }
);

// Define and export the Job Model
const Job = mongoose.model<IJob>("Job", JobSchema);
export default Job;

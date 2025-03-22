import { z } from 'zod';
import { JOB_TYPE, JOB_STATUS } from "../Utils/JobConstants";


const jobSchema = z.object({
    company: z.string().min(5, "Company name is too short").max(100, "Company name is too long"),
    position: z.string().min(5, "Position name is too short").max(200, "Position name is too long"),
    jobLocation: z.string().min(1, "Job location is required"),
    jobStatus: z.enum([JOB_STATUS.PENDING, JOB_STATUS.INTERVIEW, JOB_STATUS.DECLINED]),
    jobType: z.enum([JOB_TYPE.FULL_TIME, JOB_TYPE.PART_TIME, JOB_TYPE.INTERNSHIP]),
    jobVacancy: z.string().min(1, "Job vacancy is required"),
    jobSalary: z.string().min(1, "Job salary is required"),
    jobDeadline: z.string().min(1, "Job deadline is required"),
    jobDescription: z.string().min(1, "Job description is required"),
    jobSkills: z.array(z.string()).min(1, "Job skills are required"),
    jobFacilities: z.array(z.string()).min(1, "Job facilities are required"),
    jobContact: z.string().min(1, "Job contact is required"),
});

export { jobSchema };

import { z } from 'zod';


const userRegisterSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    password: z
        .string()
        .min(8, "Password is too short (min 8 characters)")
        .min(1, "Password is required"),
});

const userLoginSchema = z.object({
    email: z.string().email("Invalid email").min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
});

const updateUserSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    location: z.string().min(1, "Location is required"),
    gender: z.enum(["male", "female", "other"]).optional(),
    role: z.enum(["admin", "recruiter", "user"]).optional(),
    resume: z.string().url("Invalid resume link").optional(),
});

export { userRegisterSchema, userLoginSchema };

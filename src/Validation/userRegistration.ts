import { z } from 'zod';


const userRegisterSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    password: z
        .string()
        .min(8, "Password is too short (min 8 characters)")
        .min(1, "Password is required"),
});

export { userRegisterSchema };

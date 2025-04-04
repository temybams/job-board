import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthRouter from "./Router/authRoutes";
import UserRouter from "./Router/userRoutes";
import authMiddleware from "./Middleware/authMiddleware";
import jobRouter from "./Router/jobRoutes";
import ApplicationRouter from "./Router/applicationRoutes";
import AdminRouter from "./Router/adminRouter";


const app = express();

app.use(cookieParser(process.env.COOKIE_SECRET));

// Middlewares
app.use(express.json());
app.use(
    cors({
        origin: ["https://mern-job-portal-seven.vercel.app", "http://localhost:5173"],
        methods: ["GET,POST,DELETE,PUT,PATCH"],
        credentials: true,
    })
);

app.use("/api/v1/Auth", AuthRouter);
app.use("/api/v1/Users", authMiddleware, UserRouter);
app.use("/api/v1/Jobs",authMiddleware, jobRouter);
app.use("/api/v1/Admin", authMiddleware, AdminRouter);
app.use("/api/v1/Application", authMiddleware, ApplicationRouter);

// Custom Middlewares
// import { authenticateUser } from "./Middleware/UserAuthenticationMiddleware";

// Routers
// import JobRouter from "./Router/JobRouter";

// import AuthRouter from "./Router/AuthRouter";
// import AdminRouter from "./Router/AdminRouter";
// import ApplicationRouter from "./Router/ApplicationRouter";

// Connecting routes
// app.use("/api/v1/Jobs", authenticateUser, JobRouter);




export default app;

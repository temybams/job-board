import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import UserRouter from "./Router/authRoutes";
import authMiddleware from "./Middleware/authMiddleware";

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

app.use("/api/v1/Auth", UserRouter);

// Custom Middlewares
// import { authenticateUser } from "./Middleware/UserAuthenticationMiddleware";

// Routers
// import JobRouter from "./Router/JobRouter";

// import AuthRouter from "./Router/AuthRouter";
// import AdminRouter from "./Router/AdminRouter";
// import ApplicationRouter from "./Router/ApplicationRouter";

// Connecting routes
// app.use("/api/v1/Jobs", authenticateUser, JobRouter);
// app.use("/api/v1/Users", authMiddleware, UserRouter);

// app.use("/api/v1/Admin", authenticateUser, AdminRouter);
// app.use("/api/v1/Application", authenticateUser, ApplicationRouter);

export default app;

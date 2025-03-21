import mongoose from "mongoose";
import dotenv from "dotenv";

import app from "./App";
import  connectDB from "./Config/dbConfig";

// DB Connection
dotenv.config();
connectDB();

const port: number = Number(process.env.PORT) || 3000;

app.get("/", (req, res) => {
    res.send("Job Hunter Server is running!");
});

// 404 Error handler
app.use("*", (req, res) => {
    res.status(404).json({ message: "Not Found" });
});

// Error Handling Middleware (default synchronous error handling middleware from Express)
app.use((err: any, req: any, res: any, next: any) => {
    if (res.headersSent) {
        next("There was a problem");
    } else {
        if (err.message) {
            res.status(err.status || 500).send(err.message);
        } else {
            res.status(500).send("Something went wrong");
        }
    }
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});

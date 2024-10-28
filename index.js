import express from "express";
import mongoose from "mongoose";
import { router as authRouter } from "./Routes/user.route.js"; // Import named export
import cors from "cors";


// Load environment variables from .env file


const app = express();
const port = 3000; // Set the port from environment variable or default to 3000

// Middleware to parse JSON
app.use(express.json());

// CORS configuration
app.use(cors({
    origin: `http://localhost:${port}`, // Use the domain or localhost
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true,
    allowedHeaders: "Content-Type, Authorization",
}));

// Use the authentication router
app.use('/api', authRouter);

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/newproject")
    .then(() => {
        console.log("Database connection established successfully");
    })
    .catch((err) => {
        console.error("Database connection error: ", err);
    });

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://${port}`);
});

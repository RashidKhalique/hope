import express from "express";
import mongoose from "mongoose";
import { router as authRouter } from "./Routes/user.route.js"; // Ensure this path is correct
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000; // Set the port

app.use(express.json());

// CORS configuration
app.use(cors({
    origin: `http://localhost:${port}`, // Allow requests from your frontend
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true,
    allowedHeaders: "Content-Type, Authorization",
}));

// Use the authentication router
app.use('/api', authRouter);
app.get('/', (req, res) => {
    res.status(200).json({ success: true, message: "Root Route Works" });
});
const mongoURI = "mongodb+srv://rashidkhanjamali26:Rashid123@auth.k88g2.mongodb.net/";

// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => {
        console.log("Database connection established successfully");
    })
    .catch((err) => {
        console.error("Database connection error: ", err);
        // Optionally, you can exit the process if you can't connect
        process.exit(1); 
    });

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});






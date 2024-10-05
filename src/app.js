import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import productRouter from "./routes/productRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import subcategoryRouter from "./routes/subcategoryRoutes.js";
import userRouter from "./routes/userRoutes.js"

const app = express();

// Log HTTP requests
app.use(morgan('dev'));

// Set up CORS with specific origin and credentials support
app.use(cors({
    origin: process.env.CORS_ORIGIN,  // Allow requests from this origin
    credentials: true                 // Enable credentials (cookies, authorization headers)
}));

// Body parsers
app.use(express.json()); // JSON डेटा को प्रोसेस करने के लिए
app.use(express.urlencoded({ extended: true })); // URL-encoded डेटा को प्रोसेस करने के लिए

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse cookies
app.use(cookieParser());



// Define routes
app.use('/api/v1/cn', categoryRouter);
app.use('/api/v1/sn', subcategoryRouter);
app.use('/api/v1/prn', productRouter);
app.use("/api/v1/users", userRouter)



export default app;

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit"; // Rate limiting
import helmet from "helmet"; // Set security HTTP headers
import mongoSanitize from 'express-mongo-sanitize'; // Sanitize MongoDB queries
import xssClean from 'xss-clean'; // Sanitize user input
import hpp from 'hpp'; // Prevent HTTP Parameter Pollution

import productRouter from "./routes/productRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import subcategoryRouter from "./routes/subcategoryRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

// Log HTTP requests
app.use(morgan('dev'));

// Set security HTTP headers
app.use(helmet());

// Define rate limiting rules
const limiter = rateLimit({
    max: 100, // Maximum number of requests
    windowMs: 15 * 60 * 1000, // Time window in milliseconds
    handler: (req, res, next) => {
        console.error(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            status: 'fail',
            message: 'Too many requests, please try again later.',
        });
    },
});

// Apply rate limiting to all requests
app.use('/api', limiter);

// Set up CORS with specific origin and credentials support
app.use(cors());

// Body parsers
app.use(express.json({ limit: '16kb' })); // JSON data ko process karne ke liye
app.use(express.urlencoded({ extended: true })); // URL-encoded data ko process karne ke liye

// Sanitize request data
app.use(mongoSanitize()); // MongoDB query sanitize karne ke liye
app.use(xssClean()); // XSS attacks se bachne ke liye sanitize user input
app.use(hpp()); // HTTP Parameter Pollution se bachne ke liye

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse cookies
app.use(cookieParser());

// Define routes
app.use('/api/v1/cn', categoryRouter);
app.use('/api/v1/sn', subcategoryRouter);
app.use('/api/v1/prn', productRouter);
app.use("/api/v1/users", userRouter);

export default app;

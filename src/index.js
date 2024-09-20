import dotenv from "dotenv";
import connectDb from "./db/index.js";

// Correcting the path if your .env is in the root directory.
dotenv.config({ path: "./config.env" });  // Assuming .env is at the root

// Connecting to the database
connectDb();


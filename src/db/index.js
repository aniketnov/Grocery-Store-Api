import mongoose from "mongoose";
import { DB_NAME } from "../contants.js";

const connectDb = async () => {
    try {
        // Constructing MongoDB URI and ensuring proper password substitution
        const DB_URI = process.env.DATABASE.replace("<db_password>", process.env.DATABASE_PASSWORD);

        const connectionInstance = await mongoose.connect(`${DB_URI}/${DB_NAME}`);

        console.log(`\nMongoDB connected successfully: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Application exits with failure
    }
};

export default connectDb;

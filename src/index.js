import dotenv from "dotenv";
import connectDb from "./db/index.js";
import app from "./app.js";

// Correcting the path if your .env is in the root directory.
dotenv.config({ path: "./config.env" });  // Assuming .env is at the root

// Connecting to the database
connectDb()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`server run at port ${process.env.PORT}`);

        })
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error);
    });



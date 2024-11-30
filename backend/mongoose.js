import mongoose from "mongoose";

try {
    mongoose.connect(process.env.DATABASE_URL);
} catch (error) {
    console.log(error)
}
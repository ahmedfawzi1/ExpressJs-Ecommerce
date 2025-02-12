import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('URL NOT DEFINED')
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DATABASE IS CONNECTED SUCCESSFULLY");

    } catch (error) {
        console.log(error);
    }
}

export default connectDB;
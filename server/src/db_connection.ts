import mongoose from "mongoose";

const connectDB = (url:string) => {
    try {
        return mongoose.connect(url)
    } catch (error) {
        console.log(error);
    }
}

export default connectDB
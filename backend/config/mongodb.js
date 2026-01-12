import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("DB Connected");
    });

    mongoose.connection.on("error", (err) => {
      console.log("MongoDB connection error:", err);
    });

    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error("DB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;

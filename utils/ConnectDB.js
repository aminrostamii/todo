import mongoose from "mongoose";

const ConnectDB = async () => {
  if (mongoose.connections[0].readyState) {
    console.log("Database already connected.");
    return;
  }

  mongoose.set("strictQuery", false); // Optional, based on your use case

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Database connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("Error connecting to database:", error.message);
    throw new Error("Database connection failed");
  }
};

export default ConnectDB;

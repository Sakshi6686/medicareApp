import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
 
mongoose.connect(process.env.MONGO_URL);

 
const db = mongoose.connection;

 
db.on("connected", () => {
  console.log("Connected to MongoDB");
});

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});


export default db;

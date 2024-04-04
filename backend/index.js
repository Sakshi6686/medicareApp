import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
 import db from "./config/dbConfig.js";
 import userRouter from "./router/userRouter.js";
 import adminRouter from "./router/adminRouter.js";
 import doctorRouter from "./router/doctorRouter.js";
 
 //import userRouter from "./routes/userRouter"
 
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT||8000;

//console.log("in back")
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
//console.log("in back 2")
// app.get('/', (req, res) => {
//   res.send("Hello World");
// });


 
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);

});
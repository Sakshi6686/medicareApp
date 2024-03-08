import express from "express";
import dotenv from "dotenv";
dotenv.config();
 import db from "./config/dbConfig.js";
const app = express();
const port = process.env.PORT||3000;


 
 
app.get('/', (req, res) => {
  res.send("Hello World");
});


 
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import db from "./config/dbConfig.js";
import userRouter from "./router/userRouter.js";
import adminRouter from "./router/adminRouter.js";
import doctorRouter from "./router/doctorRouter.js";
import messageRouter from './router/messageRouter.js';
import { Server } from 'socket.io';
import http from "http";
 

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8000;

app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use("/api/message", messageRouter);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let users = [];

io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  socket.on('addUser', (userId) => {
    const isUserExist = users.find(user => user.userId === userId);
    if (!isUserExist) {
      const user = { userId, socketId: socket.id };
      users.push(user);
      io.emit("getUsers", users);
    }
  });

  socket.on("sendMessage",({senderId,receiverId,message})=>{
          const receiver=users.find(user=>user.userId===receiverId);
          const sender=users.find(user=>user.userId===senderId);
          if(receiver){
            io.to(receiver.socketId).to(sender.socketId).emit("getMessage",{

              senderId,
              receiverId,
              message
            })
          }
  })

  socket.on("disconnect", () => {
    users = users.filter(user => user.socketId !== socket.id);
    io.emit("getUsers", users);
  });
});

server.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

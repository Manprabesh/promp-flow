import express from 'express';
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { createServer } from "http";
import { Server } from "socket.io";




dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let frontendURI = "";
if (process.env.NODE_ENV == "production") {
  frontendURI = process.env.FRONTEND_URI
} else {
  frontendURI = "http://localhost:5173"
}

app.use(cors({
  origin: frontendURI,
  credentials: true,
}));
app.use(cookieParser())

//routers
import authRouter from './routes/auth.router.js';
import messageRouter from './routes/message.router.js';
app.use("/api/v1", authRouter);
app.use("/api/v1", messageRouter);

import groupRouter from './routes/group.router.js';
app.use("/api/v1", groupRouter);


const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: frontendURI,
    methods: ["GET", "POST"]
  }
});



io.on("connection", (socket) => {
  console.log("socket is connected", socket.id);
  
  //receive data for the room
  socket.on("send_new_message", async (data) => {
    console.log("incoming message", data.roomId);
    socket.to(data.roomId).emit("roomData", {
      nodes: data.nodes,
      response: data.response,
      edges: data.edges,
      roomId: data.roomId
    });
  })

  //close socket room
  socket.on("close_room", (roomId) => {
    io.to(roomId).emit("room_closed", { message: "Room has been closed" });
    io.socketsLeave(roomId);
    console.log(`Room ${roomId} closed`);
  })

  //user join room socket
  socket.on("join_room", async (roomID) => {

    try {

      console.log("joining room", roomID);
      // const roomName = await linkValidator(roomID);
      socket.join(roomID)
      console.log("joined room Name", roomID);

      const sockets = await io.in(roomID).fetchSockets();
      // console.log("all the sockets in the room", sockets);
      if (sockets.length > 1) {
        const members = sockets.map(s => ({ id: s.id }));
        socket.emit(roomID, members);
      }
      // Loop through each socket
      sockets.forEach(socket => {
        console.log("Socket ID:", socket.id);
        console.log("Socket data:", socket.data); // custom data you stored
      });

    } catch (error) {
      console.log("socket error", error)
      socket.on("error", (err) => {
        console.error("Socket error:", err);
      });
    }
  })
});




httpServer.listen(PORT, () => {
  console.log("app is running on port", PORT)
});
/* import { Response, Request } from "express";
import { Socket } from "socket.io";
import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
//const io = new Server(server, {cors: {origin: "*"}});
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

app.get('/', (req: Request, res: Response) => {
 res.send('ydsffvdsfol');
 
});

io.on('connection', (socketChanel) => {

  socketChanel.on('client-message-sent', (message: string) => {
    console.log(message);
  });

  console.log('a user connected');

  
});


const PORT = process.env.PORT || 3020


app.listen(PORT, () => {
    
  console.log(`listening on *:${PORT}`);
}); */

const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const port = process.env.PORT || 3020


let messagesStore:any[] = [
  {user: {id: '1', name: 'Andy'}, message: 'hey'},
  {user: {id: '2', name: 'Ernst'}, message: 'yo'},
  {user: {id: '3', name: 'kjbkn'}, message: 'yo'},
]

const users = new Map()

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket:any) => {
  console.log(`User Connected: ${socket.id}`);

  users.set(socket, {user: {id: new Date().getTime(), name: 'anonym'}})


  socket.on('disconnect', () => {
    users.delete(socket)
  })

  socket.emit('init-messages', messagesStore)

  socket.on('client-name-sent', (name: string, successFn: (value: string) => void) => {
    if(typeof name !== 'string' || name.length > 20 ) {
      successFn('Name should be less than 20 letters')

      return
    }
    const user = users.get(socket)
     user.name = name
  })

  socket.on('client-message-sent', (data: string, ) => {

    if(typeof data !== 'string') {
       return
    }

    const user = users.get(socket)

    const newMessage = {user: {id: user.id, name: user.name }, message: data}
    
    messagesStore.push(newMessage);

    socket.emit('notify-about-newMessage', newMessage)
      
  })

  socket.on('user-typed', () => {
    console.log('typing...' + users.get(socket).name);
    
    socket.broadcast.emit('user-typing', users.get(socket))
  })
});

server.listen(port, () => {
  console.log("SERVER IS RUNNING");
});
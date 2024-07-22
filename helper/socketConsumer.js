
// ss
const app = require('express')();
const httpServer = require('http').createServer(app);
// const io = require('socket.io')(httpServer);

const { Server } = require("socket.io");
var io;
exports.socketConnection = (server,socketPort) => {

     io = new Server(httpServer, {
        /* options */

        // cors: {
        //     origin: "*",
        //     methods: ["PUT", "GET", "POST", "DELETE", "PATCH", "OPTIONS"],
        //     credentials: false,
        //     transports: ["websocket", "polling"],
        // },

           cors: {
             origin: "*",
             methods: ["GET", "POST"],
           },
    });

    httpServer.listen(socketPort, () => {
        console.log("Socket server is running at port ",socketPort);
      });

    // io.use((socket,next)=>{
    //     const username = socket.auth.username;
    //     console.log("username = ",username);
    //     if(!username){
    //       return next(new Error ("Invalid username"));
    //     }
    //     socket.username = username;
    //     next();
    //   })
    // console.log("io:-",io)
  io.on('connection', (socket) => {
    console.log(`Client connected [id=${socket.id}]`);
    // socket.join(socket.request._query.id);
    ioSocket = socket;
    socket.on('disconnect', () => {
      console.info(`Client disconnected [id=${socket.id}]`);
    });

  });

};

// exports.sendMessage = (roomId, key, message) => io.to(roomId).emit(key, message);
// exports.getRooms = () => io.sockets.adapter.rooms;


exports.sendProductUploadProgress = (message)=>{
  io.sockets.emit("product_upload_progress",{progress:message});
}

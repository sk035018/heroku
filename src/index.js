const express = require("express");
const path = require('path');
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
let uid = 1;
const users = {};

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './../public/index.html'));
});

app.get('/', (req, res) => {
    res.sendFile('/index.html');
})

io.on("connect", (socket) => {
  const user = `user${uid}`;
  users[user] = socket.id;
  socket.emit("user", user);
  socket.broadcast.emit("onlineAlert", user);
  uid++;
  console.log(users);
  socket.on("disconnect", (reason) => {
    io.emit("offlineAlert", `${user} is offline due to ${reason}`);
    users[user] = null;
    console.log(users);
  });
  socket.on('newMessage', ({ to, message }) => {
      const id = users[to];
      if(id) {
        io.to(id).emit('sentMessage', `${user} : ${message}`);
      } else {
          socket.emit('noUser', `May be ${to} is offline `);
      }
  })
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server Started on port 3000");
});

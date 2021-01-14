let username;
const socket = io();
const online = document.getElementById("online");
const display = document.getElementById("display");

const clickHandle = () => {
    const message = document.getElementById('message');
    const to = document.getElementById('to');
    
    socket.emit('newMessage', {to: to.value, message: message.value});

    display.innerHTML = `${display.innerHTML}\nMe : ${message.value}`;

    message.value = '';

};

socket.on('noUser', (message) => {
    display.innerHTML = `${display.innerHTML}\n${message}`;
});

socket.on('sentMessage', (message) => {
    display.innerHTML = `${display.innerHTML}\n${message}`;
});

socket.on("onlineAlert", (data) => {
  online.innerHTML = `${online.innerHTML}\n${data} is online`;
});

socket.on("offlineAlert", (data) => {
  online.innerHTML = `${online.innerHTML}\n${data}`;
});

socket.on("connect", () => {
  socket.on("user", (data) => {
    username = data;
    online.innerHTML = `${online.innerHTML}\nyou are online as ${data}`;
  });
});

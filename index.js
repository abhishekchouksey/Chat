const express = require('express');
const path = require('path');
const http = require('http');

var app = express();
var server = http.createServer(app);

const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));

var userCount = 0;
io.on('connection', (socket)=>{
  socket.on('add user', (username)=>{
    socket.username = username;
    userCount++;
    socket.emit('login', {userCount : userCount});
    socket.broadcast.emit('user joined', {username : socket.username, userCount : userCount });    
  });

  socket.on('new message', (message)=>{
    socket.broadcast.emit('new message', {username : socket.username, message : message });
  });
})

var port = 3000;
server.listen(port, ()=> {
  console.log('Server starts at port %d', port);
})
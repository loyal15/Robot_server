
// 'use strict';

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 4500;

app.get('/', function(req, res) {
    res.sendfile('./html/index.html');
});

io.on('connection', function(socket) {
    console.log('A user connected');

    socket.on('message', function(msg) {
        console.log('message:' + msg);

        // broadcast
        // io.emit('message', msg);
        io.send(msg);
    });
});

http.listen(port, function() {
   console.log('listening on :' + port);
});


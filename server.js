
// 'use strict';

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 4500;
var clients = [];

app.get('/', function(req, res) {
    res.sendfile('./html/index.html');
});

// io.on('connection', function(socket) {
//     console.log('A user connected');

//     socket.on('message', function(msg) {
//         console.log('message:' + msg);

//         // broadcast
//         // io.emit('message', msg);
//         io.send(msg);
//     });
// });

io.sockets.on('connection', function(socket) {
    socket.on('login', function(data) {
        var clientInfo;

        try {
            const jsonData = JSON.parse(data);
        } catch(err) {
            console.error(err);
        }
        console.log('uid:'+ jsonData.uid);

        clientInfo.uid = jsonData.uid;
        clientInfo.id = socket.id;

        clients.push(clientInfo);

        console.log(clientInfo.uid + ' connected');
    });

    socket.on('message', function(data) {
        try {
            const jsonData = JSON.parse(data);
        } catch(err) {
            console.error(err);
        }

        for (var i = 0; i < clients.length; i++) {
            var client = clients[i];
            console.log('client.uid = ' + client.uid);

            if (client.uid == jsonData.uid) {
                io.sockets.socket(client.id).send(jsonData.msg);
                break;
            }
        }
    });

    socket.on('disconnect', function() {
        for (var i = 0; i < clients.length; i++) {
            var client = clients[i];
            if (client.id == socket.id) {
                clients.splice(i, 1);
                break;
            }
        }
        console.log('User disconnected');
    });
});

http.listen(port, function() {
   console.log('listening on :' + port);
});


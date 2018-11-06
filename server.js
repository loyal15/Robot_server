
// 'use strict';

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendfile('./html/index.html');
});

io.on('connection', function(socket) {
    console.log('A user connected');

    socket.on('message', function(msg) {
        console.log('message:' + msg);

        // broadcast
        // io.emit('message', msg);
        io.send('message', msg);
    });
});

http.listen(4500, function() {
   console.log('listening on *:4500');
});









// var server = require('http').createServer(app);
// var io = require('socket.io').listen(server);
// var PORT = 4500;

// server.listen(PORT);
// console.log('Server is running');

// server.route({method:'GET',path:'/',handler: (req,res) => { 
//     return res.file('./html/index.html');
// }});

// app.get('/', (req, res)) => {
//     res.file('/.html/index.html');
// }

// const init = async() => {
//     await server.register(require('inert'));
//     await server.start();    
//     console.log('Robot Backend(RESTful API) Server has started on port ' + port);
// }
// const initLive = async() => {
//     await serverLive.start();    
//     console.log('RobotApp Server has started on port ' + portLive);
//     require('./robot-server/socket_io_server')(serverLive);
// }

// server.route({method:'GET',path:'/',handler: (req,res) => { 
//     return res.file('./html/index.html');
// }});


// init();
// initLive();



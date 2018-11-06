
// 'use strict';

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// BotMaster
const Botmaster = require('botmaster');
const SocketioBot = require('botmaster-socket.io');
const botmaster = new Botmaster();

const socketioSettings = {
  id: 'SOME_BOT_ID_OF_YOUR_CHOOSING',
  server: botmaster.server, // this is required for socket.io. You can set it to another node server object if you wish to. But in this example, we will use the one created by botmaster under the hood
};

const socketioBot = new SocketioBot(socketioSettings);
botmaster.addBot(socketioBot);



botmaster.use({
  type: 'incoming',
  name: 'my-middleware',
  controller: (bot, update) => {
    return bot.reply(update, 'Hello world!');
  }
});

app.get('/', function(req, res) {
    res.sendfile('./html/index.html');
});

io.on('connection', function(socket) {
    console.log('A user connected');

    socket.on('message', function(msg) {
        console.log('message:' + msg);

        // broadcast
        // io.emit('message', msg);
        botmaster.use();

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



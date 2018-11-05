
// 'use strict';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { listeners } from 'cluster';

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const PORT = 4500;

server.listen(PORT);
console.log('Server is running');

app.get('/', (req, res)) => {
    res.file('/.html/index.html');
}


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




// 'use strict';
import express from 'express';

//-------------------------------------------------------//
var Hapi = require('hapi');
//-------------------------------------------------------//
var port = 80;
var server = new Hapi.Server({ port: port });

var portLive = 4500;
var serverLive = new Hapi.Server({ port:portLive});

const init = async() => {
    await server.register(require('inert'));
    await server.start();    
    console.log('Robot Backend(RESTful API) Server has started on port ' + port);
}
const initLive = async() => {
    await serverLive.start();    
    console.log('RobotApp Server has started on port ' + portLive);
    require('./robot-server/socket_io_server')(serverLive);
}

server.route({method:'GET',path:'/',handler: (req,res) => { 
    return res.file('./html/index.html');
}});


init();
initLive();

var d = new Date();
console.log( d.getTime());


/*
 * (C) Copyright 2018.10 Robot Server Administrator
 */

'use strict';

//-----------------------------------------------------------//
//-----------------------------------------------------------//
//-----------------------------------------------------------//
class User {
    constructor( owner_id, socket_id, socket ) {
        this.owner_id = owner_id;   // email
        this.socket_id = socket_id; // socket.id
        this.socket = socket;
    }
   
}
class UserRegistry {
    constructor() {
        this.usersByOwner = {};
        this.usersBySocket = {};
    }    

    register(user) {
        this.usersByOwner[user.owner_id] = user;
        this.usersBySocket[user.socket_id] = user;
    }

    unregister(owner_id) {
        let user = this.getByOwner(owner_id);
        if (user) delete this.usersByOwner[owner_id]
        if (user && this.getBySocket(user.socket_id)) delete this.usersBySocket[user.socket_id];
    }
 
    removeByOwner(owner_id) {
        let user = this.getByOwner(owner_id);
        if (user) delete this.usersByOwner[owner_id]
        if (user && this.getBySocket(user.socket_id)) delete this.usersBySocket[user.socket_id];
    }
 
    removeBySocket(socket_id) {
        let user = this.usersBySocket[socket_id];
        if (!user) return;
        delete this.usersBySocket[socket_id];
        delete this.usersByOwner[user.owner_id];
    }

    getByOwner(owner_id) {
        return this.usersByOwner[owner_id];
    }

    getBySocket(socket_id) {
        return this.usersBySocket[socket_id];
    }

}    

var theUserRegistry   = new UserRegistry();


module.exports = function(server) {
    function validate(param) {
        if (  !param || param === '' ) {
            return false;
        }
        return true;
    }
    function sendMessage(to,message) {
        if( !to ) {
            return
        }
        to.socket.emit("message",message);
    }

    // var io = require('socket.io').listen(server);
    var io = require('socket.io').listen(server.listener);
    io.sockets.on('connection', function (socket) {

        console.log('Connection ' + socket.id + '***');

        socket.emit('message',JSON.stringify({
            id : 'connected',
            response : 'accepted',
        }));
    
        socket.on('disconnect', function () {
            console.log('Connection ' + socket.id + ' closed --- ');

            let user = theUserRegistry.getBySocket(socket.id);
            if( user && user.socket_id == socket.id )  {
                let userid = user.owner_id
                console.log(user.socket_id+" : " + userid)
                // console.log(userid)
                // broadcast
                io.sockets.emit("message",JSON.stringify({
                    id:"userExit",
                    name:userid
                }));
                theUserRegistry.removeBySocket( socket.id );
            }
            else {
                console.log('Already reconnected socket : ' + socket.id );

            }
            
            
        });
        
        socket.on('message', function(_message) {
            var message = JSON.parse(_message);
            console.log("receive from client " + message.id);
            switch( message.id ) {
                case 'register':
                    if( validate(message.owner) == false )
                        break
                    console.log( "new user socket id:" + socket.id );
                    var user = theUserRegistry.getByOwner(message.owner);
                    if( !user ) {
                        theUserRegistry.register( new User(message.owner,socket.id,socket) );
                    } else {
                        console.log( "old socket id:" + user.socket.id );
                        user.socket = socket;
                        user.socket_id = socket.id;
                    }

                    // broadcast
                    socket.broadcast.emit("message",JSON.stringify({
                        id:"userEnter",
                        name : message.owner,
                    }));        
                    
                    break;
                case 'unregister':
                    if( validate(message.owner) == false )
                        break
                    var user = theUserRegistry.getByOwner(message.owner);
                    if( user ) {
                        theUserRegistry.removeByOwner(message.owner);
                    }
                    break;
                case 'audio': // audio
                    break;
                case 'video': // video
                    break;
                case 'text': // text
                    break;
                }
        });
    })
}



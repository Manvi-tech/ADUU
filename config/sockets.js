
module.exports.Socket = function(server){
   
    let io = require('socket.io')(server);

    io.on('connection', function(socket){
        socket.on('join-room', (roomId, userId)=>{
            socket.join(roomId);
            socket.to(roomId).emit('user-connected', userId);
            // messages
            socket.on('message', (message) => {
                //send message to the same room
                io.to(roomId).emit('createMessage', message)
            });
            socket.on('disconnect', function(){
                socket.to(roomId).emit('user-disconnected', userId);
            }); 
        });
    });
}

module.exports.Socket = function(server){
   
    let io = require('socket.io')(server);

    io.on('connection', function(socket){

        socket.on('join-room', (roomId, userId)=>{
            socket.join(roomId);
            socket.to(roomId).emit('user-connected', userId);
          
            socket.on('message', (message, username, useremail) => {
                //send message to the same room
                io.to(roomId).emit('createMessage', message, username, useremail)
            });

            socket.on('draw', (lastX, lastY, offsetX, offsetY, pencilColor, pencilWidth) => {
                socket.broadcast.to(roomId).emit('drawing', lastX, lastY, offsetX, offsetY, pencilColor, pencilWidth);
            });
            
            socket.on('disconnect', function(){
                socket.to(roomId).emit('user-disconnected', userId);
            }); 
        });

    });
}
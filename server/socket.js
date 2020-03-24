const socketioJwt = require('socketio-jwt')
module.exports = (server) => {
    const io = require('socket.io')(server)

    io.on('connection', (socket) => {
        
    });

} 
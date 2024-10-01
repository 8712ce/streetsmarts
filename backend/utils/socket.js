let io;

module.exports = {
    init: (server) => {
        io = require('socket.io')(server, {
            cors: {
                origin: 'http://localhost:3000',
                methods: ['GET', 'POST'],
                allowedHeaders: ['Content-Type'],
                credentials: true,
            },
        });
        return io;
    },
    getIo: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    },
};
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app)
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log("User conected")

    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to the chat.',
        createAt: new Date().toLocaleTimeString()
    });

    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'Someone just joined.',
        createAt: new Date().toLocaleTimeString()
    });

    socket.on('createMessage', (message) => {
        console.log('new message:', message)

        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createAt: new Date().toLocaleTimeString()
        });
        
    })

    socket.on('disconnect', () => {
        console.log('User disconnected.')
    })
})
//ddd


server.listen(port , () => {
    console.log(`Server start on port ${port}.`)
}); 
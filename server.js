const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users')
const { EmojiPicker } = require('emoji-picker')

const app = express()
const port = process.env.PORT || 4000
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, 'public')))

const botname = "ChatCord Bot";

//corre cuando el cliente se conecta
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room)

        socket.join(user.room)

        //mensaje de bienvenida al usuario
        socket.emit('message', formatMessage(botname, 'Bienvenido a ChatCord!'))

        //broadcast cuando un usuario se conecta
        socket.broadcast.to(user.room).emit(
            'message',
            formatMessage(botname, `${user.username} se unió al chat`)
        )

        //enviar info de los usuarios y la sala
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    //escuchar el evento chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id)

        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })

    //cuando un usuario de desconecta
    socket.on('disconnect', () => {
        const user = userLeave(socket.id)

        if (user) {
            io.to(user.room).emit('message', formatMessage(botname, `${user.username} se retiró del chat`))

            //enviar info de los usuarios y la sala
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }

    })
})

server.listen(port, () => console.log(`Example app listening on port ${port}!`))

const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

//Obtener el username y room de la url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io();

//unirse a una sala
socket.emit('joinRoom', { username, room })

//obtener la sala y los usuarios
socket.on('roomUsers', ({room,users}) => {
    outputRoomName(room)
    outputUsers(users)
})

//mensaje del servidor
socket.on('message', message => {
    outputMessage(message)

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight
})

//enviar mensaje
chatForm.addEventListener('submit', (e) => {
    e.preventDefault()

    //obtener el mensaje escrito por el usuario
    const msg = e.target.elements.msg.value

    //emitir el mensaje al servidor
    socket.emit('chatMessage', msg)

    //limpiar el input
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

//mostrar el mensaje en el DOM
function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p><p class="text">${message.text}</p>`
    document.querySelector('.chat-messages').appendChild(div);
}

//mostrar el nombre de la sala en el DOM
function outputRoomName(room){
    roomName.innerText = room
}

//mostrar la lista de usuarios en el DOM
function outputUsers(users){
    userList.innerHTML = `
        ${users.map(user => `<li class="${user.username === username ? 'user-actual' : ''}" >${user.username}</li>`).join('')}
    `
}

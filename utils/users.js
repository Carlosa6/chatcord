const users = []

//Usuario se une al chat
function userJoin(id, username, room) {
    const user = { id, username, room }
    users.push(user)
    return user;
}

//obtener usuario actual
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

//obtener los usuarios de una sala
function getRoomUsers(room){
    return users.filter(user => user.room === room)
}

//usuario abandona el chat
function userLeave(id){
    const index = users.findIndex(user => user.id === id)

    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

module.exports = {
    userJoin,
    getCurrentUser,
    getRoomUsers,
    userLeave
}
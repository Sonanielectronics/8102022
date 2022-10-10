let users = [];
function joinUser(socketId , userName, roomName) {
const user = {
  socketID :  socketId,
  username : userName,
  roomname : roomName
}
  users.push(user)
return user;
}


function findUser(id) {
  return users.find((user)=>{
    user.id === id;
  })
}


function removeUser(id) {
  const getID = users => users.socketID === id;
 const index =  users.findIndex(getID);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// function getRoomUsers(roomName) {
//     // return users.filter(user => user.room === roomName);  // one possibility here
//     return users.filter(user => user.roomName === roomName);
// }  // 1
module.exports ={ joinUser,removeUser,findUser
    // ,getRoomUsers 2
}
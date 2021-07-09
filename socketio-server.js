module.exports = (games, io) => {
    return (socket) => {
        console.log('connect ' + socket.id);
      
        socket.on('disconnecting', () => {
            console.log('disconnect ' + socket.id);
            console.log(socket.rooms);
            io.to(getLastValue(socket.rooms)).emit("gameEnd");
        });
        socket.on('leave-room', () => {
            games.chain().find({RoomName: getLastValue(socket.rooms)}).remove();
            socket.leave(getLastValue(socket.rooms));
            console.log(games);
        });
        socket.on('join-create-room', (clientData) =>{
          game = games.findOne({RoomName: clientData.RoomName});
          
          //Create Room if it doesn't exist
          if(game == null){  
            games.insert({ RoomName: clientData.RoomName,  password: clientData.pw, full: false, user1: socket.id, user2: "" });
            game = games.findOne({RoomName: clientData.RoomName});
            console.log(game);
      
            socket.join(clientData.RoomName);
            socket.emit("status", "wait");
            console.log(socket.rooms);
            console.log(getLastValue(socket.rooms));
            //Tried to join full game
          }else if(game.full == true){
            socket.emit("status", "full");
            //Wrong password in a game
          } else if(game.password != clientData.pw){
            socket.emit("status", "bad password");
            //If you are the second player to join a game
          } else {
            game.full=true;
            game.user2 = socket.id;
            games.update(game);
            socket.join(clientData.RoomName);
            console.log(game);
            console.log("test");
            io.to(clientData.RoomName).emit("status", "start");
          } 
        });
      }
}


function getLastValue(set){
    let value;
    for(value of set);
    return value;
  }
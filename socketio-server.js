module.exports = (games, io) => {
    return (socket) => {
        console.log('connect ' + socket.id);
      
        socket.on('debug', (debug) => {
            console.log('debug: ' + debug);
        }); 

        socket.on('disconnecting', () => {
            console.log('disconnect ' + socket.id);
            games.chain().find({RoomName: getLastValue(socket.rooms)}).remove();
            io.to(getLastValue(socket.rooms)).emit("gameEnd");
        });

        socket.on('leave-room', () => {
            games.chain().find({RoomName: getLastValue(socket.rooms)}).remove();
            socket.leave(getLastValue(socket.rooms));
        });
        socket.on('join-create-room', (clientData) =>{
          game = games.findOne({RoomName: clientData.RoomName});
          
          //Create Room if it doesn't exist
          if(game == null){  
            games.insert({ RoomName: clientData.RoomName,  password: clientData.pw, full: false, user1: socket.id, user2: "", layoutsReceived: 0, layouts: "" });
            game = games.findOne({RoomName: clientData.RoomName});
      
            socket.join(clientData.RoomName);
            socket.emit("status", "wait");
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
            io.to(clientData.RoomName).emit("status", "start");
          } 
        });

        socket.on('gameUpdate', (data) => {
          socket.to(getLastValue(socket.rooms)).emit("gameUpdate", data);
      });
      socket.on('placedShips', (data) => {
          game = games.findOne({RoomName: data.RoomName});
          game.layouts[game.layoutsReceived] = data.layout;
          game.layoutsReceived += 1;
          if(game.layoutsReceived == 2){
            io.to(getLastValue(socket.rooms)).emit("gameUpdate", "bothReady");
          } else {
            socket.to(getLastValue(socket.rooms)).emit("gameUpdate", "opponentReady");
          }
          games.update(game);
      });
      }
}


function getLastValue(set){
    let value;
    for(value of set);
    return value;
  }
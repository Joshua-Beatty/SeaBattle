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
            games.insert({ RoomName: clientData.RoomName,  password: clientData.pw, full: false, user1: socket.id, user2: "", layoutsReceived: 0, layouts: [], turn: "" });
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
          game.layouts[game.layoutsReceived] = {id: socket.id, layout: data.layout};
          game.layoutsReceived += 1;
          games.update(game);
          if(game.layoutsReceived == 2){
            game.turn = Math.floor(Math.random()*2)
            games.update(game);
            io.to(getLastValue(socket.rooms)).emit("gameUpdate", {message:"bothReady", turn: game.layouts[game.turn].id});
          } else {
            socket.to(getLastValue(socket.rooms)).emit("gameUpdate", {message:"opponentReady"});
          }
          console.log(game.turn);
      });
      }
}


function getLastValue(set){
    let value;
    for(value of set);
    return value;
  }
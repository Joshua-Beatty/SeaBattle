var socket = io();

socket.on('connect', onConnect);

function onConnect(){
  socket.emit("join-create-room", clientData)
  console.log('connect ' + socket.id);

  socket.on("status", (status) => {
    if(status == "wait"){
      startGame(socket, 0);
    } else if(status == "full"){
      window.location.href='room-list?warning=Room%20is%20Full'
    } else if(status == "bad password"){
      window.location.href='room-list?warning=Bad%20Password'
    } else if(status == "start"){
      startGame(socket, 1);
    }
  });

  socket.on("gameEnd", () =>  {    
    socket.emit("leave-room")
    window.location.href='room-list?warning=Opponent Disconnected'
  })

  socket.on("debug", (...args) =>  {
    console.log(args);
  })

}

function startGame(socket, state){
  if(state == 1){
    document.getElementsByClassName("page-button")[0].style.display = "none";
    document.getElementById("waiting-text").style.display = "none";
    var game = new Phaser.Game(config);
  }






}



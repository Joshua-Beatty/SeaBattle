var socket = io();

socket.on('connect', onConnect);

function onConnect(){
  socket.emit("join-create-room", clientData)
  console.log('connect ' + socket.id);

  socket.on("status", (status) => {
    if(status == "wait"){
      

    } else if(status == "full"){

    } else if(status == "bad password"){

    } else if(status == "good"){
      
    }
  });

  socket.on("debug", (...args) =>  {
    console.log(args);
  })
}

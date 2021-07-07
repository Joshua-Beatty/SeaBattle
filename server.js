var express = require("express")
var app = express()

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 8000;
var eta = require("eta")
const { check } = require('express-validator');
const loki = require('lokijs');

app.engine("eta", eta.renderFile)
app.set("view engine", "eta")
app.set("views", "./views")
app.use(express.static('public'))

var db = new loki('seaBattle.db');
var games = db.addCollection('games');

games.insert([{ RoomName: 'Thor',  password: "123",full: false, id: 124653, user1: "1253", user2: "" },
{ RoomName: 'Thorium',  password: "", full: false, id: 121233, user1: "1223", user2: "" },
{ RoomName: 'Jak Dum', password: "", full: false, id: 124323, user1: "1323", user2: "" },
{ RoomName: 'blank lol', full: true, id: 128793, user1: "1243", user2: "1233" }, ]);
/*
result = games.find({ full: false }); 
console.log("result 1 : ");
console.log(result);*/

app.get("/", function (req, res) {
  res.render("index", {
    h1: "Hello World", 
    reasons: ["fast", "lightweight", "simple"]
  })
})
app.get("/quick-play/", function (req, res) {
  res.render("index", {
    h1: "quick-play",
    reasons: ["fast", "lightweight", "simple"]
  })
})
app.get("/create-room/", function (req, res) {
  res.render("create-room", {
    h1: "create-room",
    reasons: ["fast", "lightweight", "simple"]
  })
})
app.get("/room-list/", function (req, res) {
  res.render("room-list", {
    h1: "room-list"})
})
app.get("/play", function (req, res) {
  res.render("play", {
    h1: "play",
    RoomName: req.query.RoomName
  })
})
app.get("/auth", function (req, res) {
  allRooms = JSON.parse(JSON.stringify(games.find({ RoomName: req.query.RoomName, password: req.query.pw })));
  res.send(allRooms)
})

app.get("/open-rooms/", function (req, res) {
  roomDetailsToSend = []
  allRooms = JSON.parse(JSON.stringify(games.find({ full: false })));
  allRooms.forEach(function(v){ 
    tempObj = {
      RoomName: v.RoomName,
    }
    if(v.password == ""){
      tempObj.password = "no"
    }else{
      tempObj.password = "yes"
    }
    roomDetailsToSend.push(tempObj);
  });
  res.send(roomDetailsToSend);
})


io.on('connect', onConnect);
server.listen(port, () => console.log('server listening on port ' + port));

function onConnect(socket){
  console.log('connect ' + socket.id);

  socket.on('disconnect', () => console.log('disconnect ' + socket.id));
  socket.on('join-create-room', (clientData) =>{
    game = games.findOne({RoomName: clientData.RoomName});
    console.log(game);
    if(game == null){
      games.insert({ RoomName: clientData.RoomName,  password: clientData.pw, full: false, user1: socket.id, user2: "" });
      game = games.findOne({RoomName: clientData.RoomName});
      console.log(game);

      socket.join(clientData.RoomName);
      socket.emit("status", "wait");
    }else if(game.full == true){
      socket.emit("status", "full");
    } else if(game.password != clientData.pw){
      socket.emit("status", "bad password");
    } else {
      game.full=true;
      game.user2 = socket.id;
      games.update(game);
      socket.join(clientData.RoomName);
      console.log(game);
      console.log("test");
      io.to(clientData.RoomName).emit("debug", "good");
    } 
  });
}
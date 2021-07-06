var express = require("express")
var app = express()
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
const WebSocket = require('ws');
let WSServer = WebSocket.Server;
let server = require('http').createServer();
let wss = new WSServer({
  server: server,
  perMessageDeflate: false
})

var id = 0;
var lookup = {};

wss.on('connection', function connection(ws) {
  ws.id = id++;
  lookup[ws.id] = ws;
  ws.on('message', function incoming(message) {
    console.log(`received: ${message} from id: ${ws.id}`, );
  });

  ws.send('something');
});

server.on('request', app);
server.listen((process.env.PORT || 8000), function() {
  console.log(`Combo http and ws server on ${(process.env.PORT || 8000)}`);
});



/*
app.listen(process.env.PORT || 8000, function () {
  console.log("listening to requests on port " + (process.env.PORT || 8000))
})   
/*

const httpServer = require("http").createServer(app);
const options = { cookie: false };
const io = require("socket.io")(httpServer, options);


io.on("connection", (socket) => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  socket.on("hello", (arg) => {
    console.log(arg); // world
  });
  socket.emit("hello", "world");
});

httpServer.listen(process.env.PORT || 8000, function () {
  console.log("listening to requests on port " + (process.env.PORT || 8000))
}); */


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

require("./express-server")(app, games);
io.on('connect', require("./socketio-server")(games, io));

server.listen(port, () => console.log('server listening on port ' + port));
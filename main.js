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

require("./express-server")(app, games);
io.on('connect', require("./socketio-server")(games, io));

server.listen(port, () => console.log('server listening on port ' + port));
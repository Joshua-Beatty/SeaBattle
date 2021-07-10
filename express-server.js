module.exports = (app, games) => {
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
        reasons: ["fast", "lightweight", "simple"],
        warning: ""
      })
    })
    app.get("/room-list/", function (req, res) {
      res.render("room-list", {
        h1: "room-list",
        warning: req.query.warning || ""
      })
    })
    app.get("/play", function (req, res) {
      if(req.query.RoomName.length > 25){
        res.render("create-room", {
          h1: "create-room",
          warning: "Room Name must be less then 25 characters"
        })
      } else {
      res.render("play", {
        h1: "play",
        RoomName: req.query.RoomName,
        pw: req.query.pw || "" 
      })
    }
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
}
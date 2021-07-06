var ws = new WebSocket('ws://localhost:8000');

ws.onmessage = function (event) {
  console.log(event.data);
};

ws.addEventListener('open', function (event) {
    ws.send("hello");
});
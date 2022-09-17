var express = require("express");
var bodyParser = require("body-parser");
var app = express();
const http = require("http");
const server = http.Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: ["https://wavefm.live"],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    transports: ["websocket"],
    credentials: true,
  },
});
// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var usersTyping = [];
io.on("connection", (socket) => {
  console.log("Connection Received");
  socket.on("usertyping", (msg) => {
    usersTyping.includes(msg) === false ? usersTyping.push(msg) : "";
    io.emit("isTyping", usersTyping);
  });
});

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", false);

  // Pass to next layer of middleware
  next();
});

app.get("/", jsonParser, (req, res) => {
  res.send("Yo");
  //   res.json("WOW");
});
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});

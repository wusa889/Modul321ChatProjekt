const express = require("express");
const http = require("http");
const cors = require('cors');
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");
const { initializeWebsocketServer } = require("./server/websocketserver");
const { initializeAPI } = require("./server/api");
const {
  initializeMariaDB,
  initializeDBSchema,
  executeSQL,
} = require("./server/database");
const { register, login } = require("./serverfunctions");

// Create the express server
const app = express();
const server = http.createServer(app);

// Use CORS with default settings (Allow all origins)
app.use(cors());

// JSON parser
app.use(express.json());

// create a livereload server
// ONLY FOR DEVELOPMENT important to remove in production
// by set the NODE_ENV to production
const env = process.env.NODE_ENV || "development";
if (env !== "production") {
  const liveReloadServer = livereload.createServer();
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
  // use livereload middleware
  app.use(connectLiveReload());
}

// deliver static files from the client folder like css, js, images
app.use(express.static("client"));
// route for the homepage
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/client/login.html");
});

app.post("/login", async (req, res) =>{
  let content = req.body
  let returnVal = await login(content);
  console.log(returnVal)
  res.status(200).send(`${JSON.stringify(returnVal[0])}`)
})

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/client/register.html");
});

app.get("/chatroom", (req, res) => {
  let login = req.body
  if(login == null){
    res.sendStatus(403).sendFile(__dirname + "/client/login.html")
  }
  res.sendFile(__dirname + "/client/chatroom.html");
});

app.post("/register", async (req, res) =>{
  let content = req.body
  console.log(content)
 let returnVal = await register(content)
 
 if(!returnVal){
   res.status(400).send(`invalid content: ${JSON.stringify(content)}`)
 }
 res.sendStatus(200) 
  
})
// Initialize the websocket server
initializeWebsocketServer(server);
// Initialize the REST api
initializeAPI(app);

// Allowing top-level await
(async function () {
  // Initialize the database
  initializeMariaDB();
  await initializeDBSchema();
  //start the web server
  const serverPort = process.env.PORT || 3000;
  server.listen(serverPort, () => {
    console.log(
      `Express Server started on port ${serverPort} as '${env}' Environment`
    );
  });
})();

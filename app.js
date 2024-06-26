const express = require("express");
const http = require("http");
const cors = require("cors");
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");
const { initializeWebsocketServer } = require("./server/websocketserver");
const { initializeAPI } = require("./server/api");
const {
  initializeMariaDB,
  initializeDBSchema,
  executeSQL,
} = require("./server/database");
const { register, login, changename, getlastten } = require("./serverfunctions");
const { verifyToken } = require("./server/auth");

const rootPath = __dirname;

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

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/client/register.html");
});

app.get("/chatroom", verifyToken, (req, res) => {
  res.sendFile(__dirname + "/client/chatroom.html");
});

app.get("/changename", verifyToken, (req, res) => {
  res.sendFile(__dirname + "/client/changename.html");
});

app.get("/lastten", verifyToken, async (req, res) => {
  const messages = await getlastten();

  if (messages === false) {
    console.log("Error retrieving messages");
    return res.status(500).send("Internal Server Error");
  }
  res.status(200).json(messages);
});

app.post("/changename", async (req, res) => {
  let content = req.body;
  let returnVal = await changename(content);
  if (returnVal === null) {
    res.status(400).send(`User not found: ${JSON.stringify(content)}`);
  } else if (returnVal === false) {
    res.status(500).send("Internal Server Error");
  } else {
    res.status(200).send({ displayname: returnVal.displayname });
  }
});

app.post("/login", async (req, res) => {
  let content = req.body;
  let returnVal = await login(content);
  if (returnVal.token) {
    res
      .status(200)
      .send({
        message: returnVal.message,
        token: returnVal.token,
        displayname: returnVal.displayname,
        id: returnVal.id,
      });
  } else {
    res.status(400).send({ message: returnVal.message });
  }
});

app.post("/register", async (req, res) => {
  let content = req.body;
  let returnVal = await register(content);

  if (!returnVal) {
    res.status(400).send(`invalid content: ${JSON.stringify(content)}`);
  }
  res.sendStatus(200);
});
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

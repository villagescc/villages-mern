require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const path = require("path");
const bodyparser = require("body-parser");
const cors = require("cors");
const router = require("./router");
//connect database
connectDB();
//Initialise middleware
app.use(cors());
app.use(express.json({ extended: true }));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// Hosting upload files
app.use("/upload", express.static("upload"));

//Define controller
app.use("/api", router);

app.use((error, req, res, next) => {
  res.status(500).send({ error: error });
});

app.use((req, res, next) => {
  res.status(404).send({ error: "Not Found" });
});

//Serve Static Assets
if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = 5000;

const server = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`)
);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
global.io = io;
require("./config/socket.js")(io);

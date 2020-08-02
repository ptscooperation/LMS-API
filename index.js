// index.js
const express = require("express");
const bodyParser = require("body-parser"); //pumal
const socketIO = require("socket.io");
const http = require("http"); //socket.io
const connectDB = require("./config/db.js");
var cors = require("cors");

// routes
const userRouter = require("./routes/user"); //auth
const books = require("./routes/api/books");
const Book = require("./models/Book"); //socket.io

const app = express();

// our server instance
const server = http.createServer(app); //socket.io

// This creates our socket using the instance of the server
const io = socketIO(server); //socket.io

app.use(express.json()); //xx
//app.use(bodyParser.urlencoded({ extended: true })); //pumal
app.use(userRouter); //auth

// Connect Database
connectDB();

// cors
app.use(cors({ origin: true, credentials: true }));

// Init Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("Hello world!"));
app.get("/users", (req, res) => res.send("Hello user!"));

// use Routes
//app.use("/post-test", books); //pumal
app.use("/api/books", books);
app.use("/users", userRouter);

io.on("connection", (socket) => {
  console.log("New client connected" + socket.id);

  // Returning the initial data of food menu from FoodItems collection
  socket.on("initial_data", () => {
    //io.sockets.emit("FromAPI", books.get("/"));
    Book.find({}).then((books) => {
      io.sockets.emit("FromAPI", books);
    });
  });

  try {
    app.post(
      "/post-test",
      bodyParser.urlencoded({ extended: false }),
      function coo(req, res, next) {
        if (!req.body.title || !req.body.isbn || !req.body.author) {
          res.status(400).json({ error: "Bad Request" });
        } else {
          Book.create(req.body);
          io.sockets.emit("FromAPIx", req.body);
          res.status(200).json({ msg: "Book added successfully" });
        }
      }
    );
  } catch (e) {
    res.status(400).json({ error: "Unable to add this book" });
    console.log(
      "There has been a problem with your fetch operation: " + e.message
    );
  }

  // disconnect is fired when a client leaves the server
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const port = process.env.PORT || 8082;

//app.listen(port, () => console.log(`Server running on port ${port}`));
server.listen(port, () => console.log(`Listening on port ${port}`));

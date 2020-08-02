// index.js

const express = require("express");
const bodyParser = require('body-parser'); //pumal
const connectDB = require("./config/db.js");
var cors = require("cors");

// routes
const userRouter = require("./routes/user"); //auth
const books = require("./routes/api/books");

const app = express();

// app.post('/post-test', (req, res) => {
//     console.log('Got body:', req.body);
//     res.sendStatus(200);
// });

app.use(express.json()); //xx
app.use(bodyParser.urlencoded({ extended: true })); //pumal
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
//app.post("/post-test", books);
app.use("/post-test", books);  //pumal
app.use("/api/books", books);
app.use("/users", userRouter);

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));

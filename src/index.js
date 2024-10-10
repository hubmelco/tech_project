const express = require("express");
const cors = require("cors");
const { userRouter } = require("./controller/userRouter");
const { postRouter } = require("./controller/postRouter");
const songRouter = require("./controller/songRouter");
require("dotenv").config();

//const exampleRouter = require("./controller/example")

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/songs", songRouter);


app.listen(PORT, () => console.log("Server listening on http://localhost:3000"));
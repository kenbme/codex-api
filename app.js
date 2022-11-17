const express = require("express");
const mongoose = require("mongoose");
const usersRouter = require("./routers/users");
const tasksRouter = require("./routers/tasks");
require("dotenv").config();

mongoose
  .connect("mongodb://127.0.0.1:27017/codex")
  .then(() => {
    console.log("MongoDB connected.");
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/", usersRouter);
    app.use("/", tasksRouter);
    app.listen(process.env.PORT, () => {
      console.log("Running on port " + process.env.PORT);
    });
  })
  .catch((error) => {
    console.error("MongoDB error. " + error);
  });

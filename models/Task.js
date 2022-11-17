const { model, Schema } = require("mongoose");

const Task = model(
  "Task",
  new Schema({
    _id: Number,
    username: String,
    name: String,
    date: Date,
    completed: Boolean,
  }),
  "tasks"
);

module.exports = Task;

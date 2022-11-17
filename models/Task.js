const { model, Schema } = require("mongoose");

const Task = model(
  "Task",
  new Schema({
    _id: Number,
    username: String,
    date: Date,
    completed: Boolean,
  }),
  "tasks"
);

module.exports = Task;

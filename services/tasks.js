const collection = "tasks";
const tasksCounter = require("./counters");
const Task = require("../models/Task");

const newTask = async (username, name, date) => {
  const _id = await tasksCounter.addTo(collection);
  const task = new Task({
    _id: _id,
    username: username,
    name: name,
    date: date,
    completed: false,
  });
  await task.save();
  return task;
};

const editTask = async (username, _id, date, completed) => {
  const task = await Task.findOneAndUpdate(
    { _id: _id, username: username },
    { $set: { date: date, completed: completed } }
  );
  return task;
};

const getTask = async (username, _id) => {
  return await Task.findOne({
    _id: _id,
    username: username,
  });
};

const getAllTasks = async (username) => {
  const tasks = await Task.find({
    username: username,
  });
  return await tasks.toArray();
};

const deleteTask = async (username, _id) => {
  const task = await Task.findOneAndDelete({
    username: username,
    _id: _id,
  });
  return task.value;
};

module.exports = { newTask, editTask, getTask, getAllTasks, deleteTask };

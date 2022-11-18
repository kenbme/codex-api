const router = require("express").Router();
const verifyToken = require("../jwt");
const { body, param, validationResult } = require("express-validator");
const tasksService = require("../services/tasks");

const requiredDate = () => {
  const date = new Date(Date.now());
  return date.toString();
};

router.post(
  "/users/:username/tasks",
  [
    body("name").isLength({ min: 1, max: 100 }).escape(),
    body("date").isISO8601().toDate().isAfter(requiredDate()),
  ],
  verifyToken,
  async (request, response) => {
    const errors = validationResult(request);
    if (errors.isEmpty()) {
      await tasksService.newTask(
        request.username,
        request.body.name,
        request.body.date
      );
      response.status(201).json({ message: "Task created." });
    } else {
      response.status(400).json(errors);
    }
  }
);

router.delete(
  "/users/:username/tasks/:task",
  [param("task").isInt({ min: 1 }).toInt()],
  verifyToken,
  async (request, response) => {
    const errors = validationResult(request);
    if (errors.isEmpty()) {
      const task = await tasksService.deleteTask(
        request.params.username,
        request.params.task
      );
      if (task) {
        response.status(200).json(task);
      } else {
        response.status(404).json({ message: "Task not found." });
      }
    } else {
      response.status(400).json(errors);
    }
  }
);

router.get("/users/:username/tasks", verifyToken, async (request, response) => {
  const tasks = await tasksService.getAllTasks(request.params.username);
  response.status(200).json(tasks);
});

router.put(
  "/users/:username/tasks/:task",
  [
    param("task").isInt({ min: 1 }).toInt(),
    body("date").isISO8601().toDate().isAfter(requiredDate()),
    body("completed").isBoolean().toBoolean(),
  ],
  verifyToken,
  async (request, response) => {
    const errors = validationResult(request);
    if (errors.isEmpty()) {
      const task = await tasksService.editTask(
        request.username,
        request.params.task,
        request.body.date,
        request.body.completed
      );
      if (task) {
        response.status(200).json(task);
      } else {
        response.status(404).json({ message: "Task not found." });
      }
    } else {
      response.status(400).json(errors);
    }
  }
);

router.get(
  "/users/:username/tasks/:task",
  [param("task").isInt({ min: 1 }).toInt()],
  verifyToken,
  async (request, response) => {
    const errors = validationResult(request);
    if (errors.isEmpty()) {
      const task = await tasksService.getTask(
        request.username,
        request.params.task
      );
      if (task) {
        response.status(200).json(task);
      } else {
        response.status(404).json({ message: "Task not found." });
      }
    } else {
      response.status(400).json(errors);
    }
  }
);

module.exports = router;

const taskService = require('../services/taskService');

const listTasks = async (req, res) => {
  try {
    const tasks = await taskService.getTasksByProject(req.params.projectId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, status, dueDate } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }
    const task = await taskService.createTask(req.params.projectId, {
      title,
      description,
      assignedTo,
      status,
      dueDate,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body, req.user.role);
    res.json(task);
  } catch (error) {
    const statusCode = error.message.includes('Access denied') ? 403 : 400;
    res.status(statusCode).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const result = await taskService.deleteTask(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
};

const Task = require('../models/Task');
const Project = require('../models/Project');

const getTasksByProject = async (projectId) => {
  return await Task.find({ project: projectId })
    .populate('assignedTo', 'name email role')
    .populate('project', 'name');
};

const createTask = async (projectId, { title, description, assignedTo, status, dueDate }) => {
  const projectExists = await Project.findById(projectId);
  if (!projectExists) {
    throw new Error('Project not found');
  }

  const newTask = new Task({
    project: projectId,
    title,
    description,
    assignedTo: assignedTo || null,
    status: status || 'To Do',
    dueDate: dueDate || null,
  });

  await newTask.save();
  return await newTask.populate([
    { path: 'assignedTo', select: 'name email role' },
    { path: 'project', select: 'name' }
  ]);
};

const updateTask = async (taskId, updates, userRole) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new Error('Task not found');
  }

  const { title, description, assignedTo, status, dueDate } = updates;

  if (userRole === 'Admin') {
    // Admin can update everything
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate || null;
  } else {
    // Members can only update status and assignee (self-assign)
    if (status !== undefined) task.status = status;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;

    // Prevent changing title, description, or due date
    if (title !== undefined && title !== task.title) {
      throw new Error('Access denied: Members cannot edit task titles');
    }
    if (description !== undefined && description !== task.description) {
      throw new Error('Access denied: Members cannot edit task descriptions');
    }
    if (dueDate !== undefined && dueDate !== (task.dueDate ? task.dueDate.toISOString().split('T')[0] : null)) {
      throw new Error('Access denied: Members cannot edit task due dates');
    }
  }

  await task.save();
  return await task.populate([
    { path: 'assignedTo', select: 'name email role' },
    { path: 'project', select: 'name' }
  ]);
};

const deleteTask = async (taskId) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new Error('Task not found');
  }

  await Task.findByIdAndDelete(taskId);
  return { message: 'Task deleted successfully' };
};

module.exports = {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
};

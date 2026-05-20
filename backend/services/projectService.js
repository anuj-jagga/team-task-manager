const Project = require('../models/Project');
const Task = require('../models/Task');

const getProjects = async () => {
  return await Project.find().populate('createdBy', 'name email');
};

const createProject = async ({ name, description, createdBy }) => {
  const newProject = new Project({
    name,
    description,
    createdBy,
  });

  await newProject.save();
  return await newProject.populate('createdBy', 'name email');
};

const deleteProject = async (projectId) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  await Project.findByIdAndDelete(projectId);
  await Task.deleteMany({ project: projectId });
  return { message: 'Project and tasks deleted successfully' };
};

module.exports = {
  getProjects,
  createProject,
  deleteProject,
};

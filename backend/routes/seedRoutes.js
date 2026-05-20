const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

router.post('/', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return res.json({ message: 'Database already has data. Seeding skipped.' });
    }

    // Seed Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@taskmanager.com',
      password: adminPassword,
      role: 'Admin',
    });
    await adminUser.save();

    // Seed Member 1
    const member1Password = await bcrypt.hash('member123', 10);
    const member1User = new User({
      name: 'Anuj Jagga',
      email: 'anuj@taskmanager.com',
      password: member1Password,
      role: 'Member',
    });
    await member1User.save();

    // Seed Member 2
    const member2Password = await bcrypt.hash('member123', 10);
    const member2User = new User({
      name: 'John Doe',
      email: 'john@taskmanager.com',
      password: member2Password,
      role: 'Member',
    });
    await member2User.save();

    // Seed Project 1
    const project1 = new Project({
      name: 'VibeCheck Web App',
      description: 'Building a beautiful glassmorphic social portal with real-time stats and metrics.',
      createdBy: adminUser._id,
    });
    await project1.save();

    // Seed Project 2
    const project2 = new Project({
      name: 'Railway Deployment Automation',
      description: 'Setup single-command deployments for multi-tier full-stack JS applications.',
      createdBy: adminUser._id,
    });
    await project2.save();

    // Seed Tasks
    const tasks = [
      new Task({
        project: project1._id,
        title: 'Design UI Theme & Palette',
        description: 'Establish the core layout, color tokens, and Tailwind configuration for the project.',
        assignedTo: member1User._id,
        status: 'Done',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      }),
      new Task({
        project: project1._id,
        title: 'Setup Mongoose Schema & Models',
        description: 'Define constraints, relations, and validation schemas for MongoDB.',
        assignedTo: member1User._id,
        status: 'In Progress',
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      }),
      new Task({
        project: project1._id,
        title: 'Deploy to Railway Staging',
        description: 'Configure environment variables and deploy production builds for selection.',
        assignedTo: member2User._id,
        status: 'To Do',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Overdue!
      }),
      new Task({
        project: project2._id,
        title: 'Document API Endpoints',
        description: 'Create markdown and text documentation for user endpoints, schema layout and auth checks.',
        assignedTo: member2User._id,
        status: 'To Do',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      }),
    ];

    await Task.insertMany(tasks);

    res.json({
      message: 'Database seeded successfully',
      seededUsers: ['admin@taskmanager.com (admin123)', 'anuj@taskmanager.com (member123)', 'john@taskmanager.com (member123)'],
      seededProjects: 2,
      seededTasks: 4
    });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding database', error: error.message });
  }
});

module.exports = router;

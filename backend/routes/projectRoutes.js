const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const taskController = require('../controllers/taskController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.use(authenticateToken);

// Project operations
router.get('/', projectController.listProjects);
router.post('/', requireAdmin, projectController.createProject);
router.delete('/:id', requireAdmin, projectController.deleteProject);

// Nested task operations
router.get('/:projectId/tasks', taskController.listTasks);
router.post('/:projectId/tasks', requireAdmin, taskController.createTask);

module.exports = router;

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.use(authenticateToken);

router.put('/:id', taskController.updateTask);
router.delete('/:id', requireAdmin, taskController.deleteTask);

module.exports = router;

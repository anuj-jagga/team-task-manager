const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, authController.getUsers);

module.exports = router;

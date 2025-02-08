'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/logController');
const authService = require('../middlewares/authMiddleware');

router.get('/', authService, controller.searchLogs);

module.exports = router;
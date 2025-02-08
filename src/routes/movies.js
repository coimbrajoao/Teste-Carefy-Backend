'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/moviesController');
const authService = require('../middlewares/authMiddleware');

router.post('/', authService, controller.post);
router.post('/:id/avaliation', authService, controller.postAvaliation);

router.put('/:id/status', authService, controller.put);

router.get('/', authService, controller.getAll);

router.get('/:id',authService, controller.getById);  
router.get('/:id/history', authService, controller.getAllHistory);

module.exports = router;

const express = require('express');
const { generateMaze, generateMazeStepwise } = require('../controllers/mazeController');

const router = express.Router();

router.get('/generate', generateMaze);
router.get('/generate-maze-step-by-step', generateMazeStepwise); // New route

module.exports = router;

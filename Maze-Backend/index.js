const express = require('express');
const { generateMaze } = require('./src/controllers/mazeController');
const router = express.Router();

router.post('/generate', generateMaze);


module.exports = router;

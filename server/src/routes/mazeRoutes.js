const express = require('express');
const router = express.Router();
const { generateMazeKruskal, generateMazePrim, calculateMetrics } = require('../utils/mazeUtils');

router.get('/generate', (req, res) => {
  const rows = parseInt(req.query.rows, 10);
  const cols = parseInt(req.query.cols, 10);

  if (isNaN(rows) || isNaN(cols) || rows < 10 || rows > 80 || cols < 10 || cols > 80) {
    return res.status(400).json({ error: 'Rows and columns must be numbers between 10 and 80.' });
  }

  try {
    const { maze: mazeKruskal, steps: stepsKruskal } = generateMazeKruskal(rows, cols);
    const { maze: mazePrim, steps: stepsPrim } = generateMazePrim(rows, cols);

    const metricsKruskal = calculateMetrics(mazeKruskal);
    const metricsPrim = calculateMetrics(mazePrim);

    res.json({
      mazeKruskal,
      stepsKruskal,
      metricsKruskal,
      mazePrim,
      stepsPrim,
      metricsPrim,
    });
  } catch (error) {
    console.error('Error generating mazes:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/generate-maze-step-by-step', (req, res) => {
  const { algorithm } = req.query;
  const rows = parseInt(req.query.rows) || 20;
  const cols = parseInt(req.query.cols) || 20;

  try {
    let result;

    if (algorithm === 'kruskal') {
      result = generateMazeKruskal(rows, cols);
    } else if (algorithm === 'prim') {
      result = generateMazePrim(rows, cols);
    } else {
      return res.status(400).json({ message: 'Invalid algorithm' });
    }

    const { maze, steps } = result;
    const metrics = calculateMetrics(maze);

    res.json({
      steps,
      metrics,
    });
  } catch (error) {
    console.error('Error generating maze:', error);
    res.status(500).json({ message: 'Error generating maze', error });
  }
});

module.exports = router;

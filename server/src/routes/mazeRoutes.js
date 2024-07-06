const express = require('express');
const router = express.Router();
const { generateMazeKruskal, generateMazePrim, calculateMetrics } = require('../utils/mazeUtils');

router.get('/generate', (req, res) => {
  const rows = parseInt(req.query.rows) || 20;
  const cols = parseInt(req.query.cols) || 20;

  try {
    const { maze: mazeKruskal, steps: stepsKruskal } = generateMazeKruskal(rows, cols);
    const { maze: mazePrim, steps: stepsPrim } = generateMazePrim(rows, cols);

    // Validate that the maze data is correct
    if (!Array.isArray(mazeKruskal) || mazeKruskal.length !== rows || !Array.isArray(mazeKruskal[0]) || mazeKruskal[0].length !== cols) {
      throw new Error('Invalid mazeKruskal generated');
    }
    if (!Array.isArray(mazePrim) || mazePrim.length !== rows || !Array.isArray(mazePrim[0]) || mazePrim[0].length !== cols) {
      throw new Error('Invalid mazePrim generated');
    }

    res.json({
      mazeKruskal,
      stepsKruskal,
      metricsKruskal: calculateMetrics(mazeKruskal),
      mazePrim,
      stepsPrim,
      metricsPrim: calculateMetrics(mazePrim),
    });
  } catch (error) {
    console.error('Error generating mazes:', error);
    res.status(500).json({ error: error.message });
  }
});
router.get('/generate-maze-step-by-step', async (req, res) => {
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
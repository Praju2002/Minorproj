const { generateMazeKruskal, generateMazePrim, calculateMetrics } = require('../utils/mazeUtils');

const { generateMazeKruskal, generateMazePrim, calculateMetrics } = require('../utils/mazeUtils');

exports.generateMaze = async (req, res) => {
  try {
    // Get rows and cols from query parameters, with defaults and validation
    const rows = Math.max(10, Math.min(80, parseInt(req.query.rows) || 20));
    const cols = Math.max(10, Math.min(80, parseInt(req.query.cols) || 20));

    const { maze: mazeKruskal } = generateMazeKruskal(rows, cols);
    const { maze: mazePrim } = generateMazePrim(rows, cols);

    const metricsKruskal = calculateMetrics(mazeKruskal);
    const metricsPrim = calculateMetrics(mazePrim);

    res.json({
      mazeKruskal,
      metricsKruskal,
      mazePrim,
      metricsPrim,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating maze', error });
  }
};


exports.generateMazeStepwise = async (req, res) => {
  try {
    const algorithm = req.query.algorithm;
    const rows = Math.max(10, Math.min(80, parseInt(req.query.rows) || 20));
    const cols = Math.max(10, Math.min(80, parseInt(req.query.cols) || 20));

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
    res.status(500).json({ message: 'Error generating maze', error });
  }
};

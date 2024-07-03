const { generateMazeKruskal, generateMazePrim, calculateMetrics } = require('../utils/mazeUtils');

exports.generateMaze = async (req, res) => {
  try {
    const { maze: mazeKruskal } = generateMazeKruskal(20, 20);
    const { maze: mazePrim } = generateMazePrim(20, 20);

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
    let result;

    if (algorithm === 'kruskal') {
      result = generateMazeKruskal(20, 20);
    } else if (algorithm === 'prim') {
      result = generateMazePrim(20, 20);
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
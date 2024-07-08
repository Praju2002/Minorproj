const { generateMazeKruskal, generateMazePrim, calculateMetrics } = require('../utils/mazeUtils');

exports.generateMaze = async (req, res) => {
  try {
    const rows = Math.max(10, Math.min(80, parseInt(req.query.rows) || 20));
    const cols = Math.max(10, Math.min(80, parseInt(req.query.cols) || 20));

    const { maze: mazeKruskal, steps: stepsKruskal } = generateMazeKruskal(rows, cols);
    const { maze: mazePrim, steps: stepsPrim } = generateMazePrim(rows, cols);

    const metricsKruskal = calculateMetrics(mazeKruskal);
    const metricsPrim = calculateMetrics(mazePrim);

    // Modify metrics objects to exclude backtrackPath
    const metricsKruskalWithoutBacktrack = {
      ...metricsKruskal,
      path: metricsKruskal.path,
    };

    const metricsPrimWithoutBacktrack = {
      ...metricsPrim,
      path: metricsPrim.path,
    };

    res.json({
      mazeKruskal,
      stepsKruskal,
      metricsKruskal: metricsKruskalWithoutBacktrack,
      mazePrim,
      stepsPrim,
      metricsPrim: metricsPrimWithoutBacktrack,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating maze', error });
  }
};

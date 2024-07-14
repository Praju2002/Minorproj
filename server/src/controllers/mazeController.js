const { generateMazeKruskal, generateMazePrim, calculateMetrics } = require('../utils/mazeUtils');

exports.generateMaze = async (req, res) => {
  try {
    // Ensure rows and cols are within the range of 10 to 80
    const rows = Math.max(10, Math.min(80, parseInt(req.query.rows) || 20));
    const cols = Math.max(10, Math.min(80, parseInt(req.query.cols) || 20));

    // Generate mazes for both algorithms
    const kruskalResult = await generateMazeKruskal(rows, cols);  // Ensure generateMazeKruskal returns a promise
    const primResult = await generateMazePrim(rows, cols);  // Ensure generateMazePrim returns a promise

    // Calculate metrics for both mazes
    const metricsKruskal = calculateMetrics(kruskalResult.maze);
    const metricsPrim = calculateMetrics(primResult.maze);

    // Modify metrics objects to exclude backtrackPath and include only the path
    const metricsKruskalWithoutBacktrack = {
      ...metricsKruskal,
      path: metricsKruskal.path,
    };

    const metricsPrimWithoutBacktrack = {
      ...metricsPrim,
      path: metricsPrim.path,
    };

    // Send response with the generated mazes, steps, and metrics
    res.json({
      mazeKruskal: kruskalResult.maze,
      stepsKruskal: kruskalResult.steps,
      metricsKruskal: metricsKruskalWithoutBacktrack,
      mazePrim: primResult.maze,
      stepsPrim: primResult.steps,
      metricsPrim: metricsPrimWithoutBacktrack,
    });
  } catch (error) {
    // Improved error handling
    console.error('Error generating maze:', error);
    res.status(500).json({ message: 'Error generating maze', error: error.message });
  }
};

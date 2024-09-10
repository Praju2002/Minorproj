const { generateMazeKruskal, generateMazePrim, calculateMetrics } = require('../utils/mazeUtils');

exports.generateMaze = async (req, res) => {
  try {
    const rows = Math.max(10, Math.min(80, parseInt(req.query.rows) || 20));
    const cols = Math.max(10, Math.min(80, parseInt(req.query.cols) || 20));

    // Generate mazes using Kruskal and Prim
    const kruskalResult = await generateMazeKruskal(rows, cols);  
    const primResult = await generateMazePrim(rows, cols);  

    // Calculate metrics asynchronously
    const metricsKruskal = await calculateMetrics(kruskalResult.maze, 'Kruskal');
    const metricsPrim = await calculateMetrics(primResult.maze, 'Prim');

    // Prepare metrics without backtrack paths but include finalPathStack
    const metricsKruskalWithoutBacktrack = {
      ...metricsKruskal,
      path: metricsKruskal.path,  // Full explored path
      finalPath: metricsKruskal.finalPathStack,  // Include final path stack
    };

    const metricsPrimWithoutBacktrack = {
      ...metricsPrim,
      path: metricsPrim.path,  // Full explored path
      finalPath: metricsPrim.finalPathStack,  // Include final path stack
    };

    // Send response to frontend with mazes, steps, and metrics
    res.json({
      mazeKruskal: kruskalResult.maze,
      stepsKruskal: kruskalResult.steps,
      finalPathKruskal: metricsKruskalWithoutBacktrack.finalPath, // Send final path separately
      metricsKruskal: metricsKruskalWithoutBacktrack,
      mazePrim: primResult.maze,
      stepsPrim: primResult.steps,
      finalPathPrim: metricsPrimWithoutBacktrack.finalPath, // Send final path separately
      metricsPrim: metricsPrimWithoutBacktrack,
    });
  } catch (error) {
    console.error('Error generating maze:', error);
    res.status(500).json({ message: 'Error generating maze', error: error.message });
  }
};

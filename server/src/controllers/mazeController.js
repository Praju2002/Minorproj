const { generateMazeKruskal, generateMazePrim, calculateMetrics } = require('../utils/mazeUtils');

exports.generateMaze = async (req, res) => {
  try {
    
    const rows = Math.max(10, Math.min(80, parseInt(req.query.rows) || 20));
    const cols = Math.max(10, Math.min(80, parseInt(req.query.cols) || 20));

   
    const kruskalResult = await generateMazeKruskal(rows, cols);  
    const primResult = await generateMazePrim(rows, cols);  

   
    const metricsKruskal = calculateMetrics(kruskalResult.maze);
    const metricsPrim = calculateMetrics(primResult.maze);

   
    const metricsKruskalWithoutBacktrack = {
      ...metricsKruskal,
      path: metricsKruskal.path,
    };

    const metricsPrimWithoutBacktrack = {
      ...metricsPrim,
      path: metricsPrim.path,
    };

    
    res.json({
      mazeKruskal: kruskalResult.maze,
      stepsKruskal: kruskalResult.steps,
      metricsKruskal: metricsKruskalWithoutBacktrack,
      mazePrim: primResult.maze,
      stepsPrim: primResult.steps,
      metricsPrim: metricsPrimWithoutBacktrack,
    });
  } catch (error) {
    
    console.error('Error generating maze:', error);
    res.status(500).json({ message: 'Error generating maze', error: error.message });
  }
};


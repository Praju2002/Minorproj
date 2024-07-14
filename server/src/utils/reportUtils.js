const { connectDB } = require('../../db');
const fs = require('fs');
const path = require('path');  // Import path module for better path handling

async function fetchMazeMetrics() {
  const db = await connectDB();
  const collection = db.collection('mazeMetrics');
  const data = await collection.find({}).toArray();
  console.log('Fetched Metrics:', data); // Debugging log
  return data;
}

function analyzeMetrics(data, algorithms) {
  const results = {};

  algorithms.forEach(algorithm => {
    // Filter metrics for the current algorithm
    const algoMetrics = data.filter(item => item.algorithm === algorithm);
    console.log(`Metrics for ${algorithm}:`, algoMetrics); // Debugging log

    if (algoMetrics.length > 0) {
      // Calculate average metrics
      const avgMetrics = algoMetrics.reduce((acc, item) => {
        acc.numIntersections += item.numIntersections || 0;
        acc.numDeadEnds += item.numDeadEnds || 0;
        acc.numSteps += item.numSteps || 0;
        acc.numVisitedIntersections += item.numVisitedIntersections || 0;
        acc.numVisitedDeadEnds += item.numVisitedDeadEnds || 0;
        return acc;
      }, {
        numIntersections: 0,
        numDeadEnds: 0,
        numSteps: 0,
        numVisitedIntersections: 0,
        numVisitedDeadEnds: 0
      });

      results[algorithm] = {
        numIntersections: avgMetrics.numIntersections / algoMetrics.length,
        numDeadEnds: avgMetrics.numDeadEnds / algoMetrics.length,
        numSteps: avgMetrics.numSteps / algoMetrics.length,
        numVisitedIntersections: avgMetrics.numVisitedIntersections / algoMetrics.length,
        numVisitedDeadEnds: avgMetrics.numVisitedDeadEnds / algoMetrics.length
      };
    } else {
      results[algorithm] = null; // No data for this algorithm
    }
  });

  console.log('Analyzed Metrics:', results); // Debugging log
  return results;
}

async function generateReport(algorithms) {
  try {
    const metrics = await fetchMazeMetrics();
    const analysis = analyzeMetrics(metrics, algorithms);

    // Use path.join for better cross-platform file path handling
    const reportPath = path.join(__dirname, '../../report.json');
    fs.writeFileSync(reportPath, JSON.stringify(analysis, null, 2));
    console.log('Report generated and saved as report.json');
  } catch (error) {
    console.error('Error generating report:', error);
    throw error; // Optional: rethrow the error if needed for error handling
  }
}
// Check if there are multiple entries
fetchMazeMetrics().then(data => {
  console.log('Fetched Metrics Count:', data.length);
  console.log('First Entry:', data[0]);
  console.log('Last Entry:', data[data.length - 1]);
});




// Export the function for use in other files
module.exports = { generateReport };

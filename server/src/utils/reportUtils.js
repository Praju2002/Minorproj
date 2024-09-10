const { connectDB } = require('../../db');
const fs = require('fs');
const path = require('path');
const { MazeMetrics } = require('../models/mazeMetrics');

async function fetchMazeMetrics() {
  try {
    const db = await connectDB();
    const collection = db.collection('mazeMetrics');
    const metrics = await collection.find({}).toArray();
    console.log('Fetched Metrics Count:', metrics.length);
    console.log('First Entry:', metrics[0]);
    console.log('Last Entry:', metrics[metrics.length - 1]);
    return metrics;
  } catch (error) {
    console.error('Error fetching maze metrics:', error);
    throw error;
  }
}

function analyzeMetrics(data, algorithms) {
  const results = {};

  algorithms.forEach(algorithm => {
    const algoMetrics = data.filter(item => item.algorithm === algorithm);
    console.log(`Metrics for ${algorithm}:`, algoMetrics); 

    if (algoMetrics.length > 0) {
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
      results[algorithm] = null;
    }
  });

  console.log('Analyzed Metrics:', results); 
  return results;
}

async function generateReport(algorithms) {
  try {
    const metrics = await fetchMazeMetrics();
    const analysis = analyzeMetrics(metrics, algorithms);

    const reportPath = path.join(__dirname, '../../report.json');
    fs.writeFileSync(reportPath, JSON.stringify(analysis, null, 2));
    console.log('Report generated and saved as report.json');
  } catch (error) {
    console.error('Error generating report:', error);
    throw error; 
  }
}

module.exports = { generateReport };

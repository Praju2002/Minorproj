const express = require('express');
const router = express.Router();
const { generateMazeKruskal, generateMazePrim } = require('../utils/mazeUtils');
const { generateReport } = require('../utils/reportUtils');
const path = require('path');
const fs = require('fs');

// Endpoint to generate mazes using Kruskal's and Prim's algorithms
router.get('/generate', async (req, res) => {
  const rows = parseInt(req.query.rows, 10);
  const cols = parseInt(req.query.cols, 10);

  if (isNaN(rows) || isNaN(cols) || rows < 10 || rows > 80 || cols < 10 || cols > 80) {
    return res.status(400).json({ error: 'Rows and columns must be numbers between 10 and 80.' });
  }

  try {
    const kruskalResult = await generateMazeKruskal(rows, cols);
    const primResult = await generateMazePrim(rows, cols);

    res.json({
      mazeKruskal: kruskalResult.maze,
      stepsKruskal: kruskalResult.steps,
      metricsKruskal: kruskalResult,
      mazePrim: primResult.maze,
      stepsPrim: primResult.steps,
      metricsPrim: primResult,
    });
  } catch (error) {
    console.error('Error generating mazes:', error);
    res.status(500).json({ error: 'Error generating mazes.' });
  }
});

// Endpoint to generate a maze step-by-step for a specified algorithm
router.get('/generate-maze-step-by-step', async (req, res) => {
  const { algorithm } = req.query;
  const rows = parseInt(req.query.rows, 10) || 20;
  const cols = parseInt(req.query.cols, 10) || 20;

  try {
    let result;

    if (algorithm === 'kruskal') {
      result = await generateMazeKruskal(rows, cols);
    } else if (algorithm === 'prim') {
      result = await generateMazePrim(rows, cols);
    } else {
      return res.status(400).json({ message: 'Invalid algorithm' });
    }

    res.json({
      steps: result.steps,
      metrics: result,
    });
  } catch (error) {
    console.error('Error generating maze:', error);
    res.status(500).json({ message: 'Error generating maze.', error });
  }
});

// Endpoint to generate and serve a report comparing maze generation algorithms
router.get('/generate-report', async (req, res) => {
  try {
    await generateReport(['Prim', 'Kruskal']); // Generate the report for both algorithms

    // Assuming generateReport generates 'report.json', read it and send its contents
    const reportPath = path.join(__dirname, '../../report.json');
    const reportData = fs.readFileSync(reportPath, 'utf8');
    res.json(JSON.parse(reportData));
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Error generating report.', error });
  }
});

module.exports = router;

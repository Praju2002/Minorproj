const mongoose = require('mongoose');

const mazeMetricsSchema = new mongoose.Schema({
  algorithm: { type: String, required: true },
  numIntersections: { type: Number, required: true },
  numDeadEnds: { type: Number, required: true },
  numSteps: { type: Number, required: true },
  numVisitedIntersections: { type: Number, required: true },
  numVisitedDeadEnds: { type: Number, required: true }
});

const MazeMetrics = mongoose.model('MazeMetrics', mazeMetricsSchema);

module.exports = { MazeMetrics };

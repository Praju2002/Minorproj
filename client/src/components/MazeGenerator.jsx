import React, { useState, useEffect } from 'react';
import Maze from './Maze.jsx';
const MazeGenerator = () => {
  const [mazeKruskal, setMazeKruskal] = useState([]);
  const [mazePrim, setMazePrim] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [performanceMetricsKruskal, setPerformanceMetricsKruskal] = useState(null);
  const [performanceMetricsPrim, setPerformanceMetricsPrim] = useState(null);

  useEffect(() => {
    if (isGenerating) {
      fetch('http://localhost:3003/api/generate')
        .then(response => response.json())
        .then(data => {
          setMazeKruskal(data.mazeKruskal);
          setMazePrim(data.mazePrim);
          setPerformanceMetricsKruskal(data.metricsKruskal);
          setPerformanceMetricsPrim(data.metricsPrim);
          setIsGenerating(false);
        })
        .catch(error => {
          console.error('Failed to fetch:', error);
          setIsGenerating(false);
        });
    }
  }, [isGenerating]);

  const startGeneration = () => {
    setIsGenerating(true);
  };

  return (
    <div>
      <button onClick={startGeneration} disabled={isGenerating}>
        {isGenerating ? 'Generating Maze...' : 'Generate Maze'}
      </button>
      <div>
        <h3>Kruskal's Algorithm Maze</h3>
        {mazeKruskal && <Maze maze={mazeKruskal} />}
        <h3>Prim's Algorithm Maze</h3>
        {mazePrim && <Maze maze={mazePrim} />}
      </div>
      {performanceMetricsKruskal && (
        <div>
          <h3>Kruskal's Algorithm Performance Metrics</h3>
          <p>Number of Intersections: {performanceMetricsKruskal.numIntersections}</p>
          <p>Number of Dead Ends: {performanceMetricsKruskal.numDeadEnds}</p>
          <p>Number of Steps: {performanceMetricsKruskal.numSteps}</p>
          <p>Number of Visited Intersections: {performanceMetricsKruskal.numVisitedIntersections}</p>
          <p>Number of Visited Dead Ends: {performanceMetricsKruskal.numVisitedDeadEnds}</p>
        </div>
      )}
      {performanceMetricsPrim && (
        <div>
          <h3>Prim's Algorithm Performance Metrics</h3>
          <p>Number of Intersections: {performanceMetricsPrim.numIntersections}</p>
          <p>Number of Dead Ends: {performanceMetricsPrim.numDeadEnds}</p>
          <p>Number of Steps: {performanceMetricsPrim.numSteps}</p>
          <p>Number of Visited Intersections: {performanceMetricsPrim.numVisitedIntersections}</p>
          <p>Number of Visited Dead Ends: {performanceMetricsPrim.numVisitedDeadEnds}</p>
        </div>
      )}
    </div>
  );
};

export default MazeGenerator;
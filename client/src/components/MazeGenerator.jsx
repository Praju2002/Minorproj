import React, { useState, useEffect } from 'react';
import Maze from './Maze.jsx';
import { Box, Button, Typography, TextField } from '@mui/material';
import { pink, purple } from '@mui/material/colors';

const MazeGenerator = () => {
  const [mazeKruskal, setMazeKruskal] = useState([]);
  const [mazePrim, setMazePrim] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [performanceMetricsKruskal, setPerformanceMetricsKruskal] = useState(null);
  const [performanceMetricsPrim, setPerformanceMetricsPrim] = useState(null);
  const [rows, setRows] = useState(20);
  const [cols, setCols] = useState(20);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isGenerating) {
      fetch(`http://localhost:3003/api/generate?rows=${rows}&cols=${cols}`)
        .then(response => response.json())
        .then(data => {
          console.log('API response:', data);
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
  }, [isGenerating, rows, cols]);

  const startGeneration = () => {
    setIsGenerating(true);
    setErrorMessage('');
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: pink[50], borderRadius: 2,textAlign:"center" }}>
      <TextField
        label="Rows"
        type="number"
        value={rows}
        onChange={(e) => setRows(Math.max(10, Math.min(80, Number(e.target.value))))}
        sx={{ marginRight: 2 }}
        inputProps={{ min: 10 ,max:80}}
      />
      <TextField
        label="Columns"
        type="number"
        value={cols}
        onChange={(e) => setCols(Math.max(10, Math.min(80, Number(e.target.value))))} 
        sx={{ marginRight: 2 }}
        inputProps={{ min: 10 ,max:80}} 
      />
      <Button 
        onClick={startGeneration} 
        disabled={isGenerating} 
        variant="contained" 
        sx={{ 
          backgroundColor: purple[200], color:"#ffffff",
          '&:hover': { backgroundColor: purple[100] },
          fontFamily: 'times new roman',
          borderRadius: 2,
          padding: '10px 20px',
          marginBottom: 4,
        }}
      >
        {isGenerating ? 'Generating Maze...' : 'Generate Maze'}
      </Button>
      <Box sx={{
        display: "flex",
        justifyContent: "space-around",
        flexDirection: "row",
        alignItems: "flex-start",
      }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: 'center' }}>
          <Typography variant="h4" sx={{ color: purple[800], marginBottom: 2 }}>
            Kruskal's Algorithm Maze
          </Typography>
          {mazeKruskal && <Maze maze={mazeKruskal} />} 
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: 'center' }}>
          <Typography variant="h4" sx={{ color: purple[800], marginBottom: 2 }}>
            Prim's Algorithm Maze
          </Typography>
          {mazePrim && <Maze maze={mazePrim} />} 
        </Box>
      </Box>
      <Box sx={{
        display: "flex",
        justifyContent: "space-around",
        flexDirection: "row",
        alignItems: "flex-start",
        marginTop: 4,
        textAlign: "left",
      }}>
        {performanceMetricsKruskal && (
          <Box sx={{ backgroundColor: pink[100], padding: 2, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ color: purple[700], marginBottom: 1 }}>
              Kruskal's Algorithm Performance Metrics
            </Typography>
            <Typography>Number of Intersections: {performanceMetricsKruskal.numIntersections}</Typography>
            <Typography>Number of Dead Ends: {performanceMetricsKruskal.numDeadEnds}</Typography>
            <Typography>Number of Steps: {performanceMetricsKruskal.numSteps}</Typography>
            <Typography>Number of Visited Intersections: {performanceMetricsKruskal.numVisitedIntersections}</Typography>
            <Typography>Number of Visited Dead Ends: {performanceMetricsKruskal.numVisitedDeadEnds}</Typography>
          </Box>
        )}
        {performanceMetricsPrim && (
          <Box sx={{ backgroundColor: pink[100], padding: 2, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ color: purple[700], marginBottom: 1 }}>
              Prim's Algorithm Performance Metrics
            </Typography>
            <Typography>Number of Intersections: {performanceMetricsPrim.numIntersections}</Typography>
            <Typography>Number of Dead Ends: {performanceMetricsPrim.numDeadEnds}</Typography>
            <Typography>Number of Steps: {performanceMetricsPrim.numSteps}</Typography>
            <Typography>Number of Visited Intersections: {performanceMetricsPrim.numVisitedIntersections}</Typography>
            <Typography>Number of Visited Dead Ends: {performanceMetricsPrim.numVisitedDeadEnds}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MazeGenerator;

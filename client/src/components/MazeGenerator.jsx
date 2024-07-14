import React, { useState, useEffect } from 'react';
import Maze from './Maze.jsx';
import { Box, Button, Typography, TextField, Snackbar, Alert } from '@mui/material';
import { pink, purple } from '@mui/material/colors';

const MazeGenerator = () => {
  const [mazeKruskal, setMazeKruskal] = useState([]);
  const [mazePrim, setMazePrim] = useState([]);
  const [pathKruskal, setPathKruskal] = useState([]);
  const [pathPrim, setPathPrim] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [performanceMetricsKruskal, setPerformanceMetricsKruskal] = useState(null);
  const [performanceMetricsPrim, setPerformanceMetricsPrim] = useState(null);
  const [rows, setRows] = useState('20');
  const [cols, setCols] = useState('20');
  const [timeDelay, setTimeDelay] = useState('200');
  const [rowsError, setRowsError] = useState('');
  const [colsError, setColsError] = useState('');
  const [timeDelayError, setTimeDelayError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mazeKey, setMazeKey] = useState(0); // State to force remount of Maze components
  const [renderingPath, setRenderingPath] = useState(false); // New state to manage path rendering
  const [reportData, setReportData] = useState(null); // State to hold report data

  useEffect(() => {
    if (isGenerating) {
      fetch(`http://localhost:3003/api/generate?rows=${rows}&cols=${cols}`)
        .then(response => response.json())
        .then(data => {
          console.log('API response:', data);
          setMazeKruskal(data.mazeKruskal);
          setPathKruskal(data.metricsKruskal.path);
          setMazePrim(data.mazePrim);
          setPathPrim(data.metricsPrim.path);
          setPerformanceMetricsKruskal(data.metricsKruskal);
          setPerformanceMetricsPrim(data.metricsPrim);
          setMazeKey(prevKey => prevKey + 1); // Update the key to force remount
          setRenderingPath(true); // Set to true while path is rendering
          setIsGenerating(false);
        })
        .catch(error => {
          console.error('Failed to fetch:', error);
          setIsGenerating(false);
          setErrorMessage('Failed to generate maze.');
          setOpenSnackbar(true);
        });
    }
  }, [isGenerating, rows, cols]);

  useEffect(() => {
    if (renderingPath) {
      // Code to manage path rendering and resetting `renderingPath`
      const timer = setTimeout(() => {
        setRenderingPath(false); // Reset after rendering
      }, Number(timeDelay) * (pathKruskal.length + pathPrim.length)); // Adjust based on path length

      return () => clearTimeout(timer); // Clear timeout if component unmounts
    }
  }, [renderingPath, pathKruskal.length, pathPrim.length, timeDelay]);

  const handleRowsChange = (e) => {
    const value = e.target.value;
    setRows(value);
    if (value < 10 || value > 80) {
      setRowsError('Rows must be between 10 and 80.');
    } else {
      setRowsError('');
    }
  };

  const handleColsChange = (e) => {
    const value = e.target.value;
    setCols(value);
    if (value < 10 || value > 80) {
      setColsError('Columns must be between 10 and 80.');
    } else {
      setColsError('');
    }
  };

  const handleTimeDelayChange = (e) => {
    const value = e.target.value;
    setTimeDelay(value);
    if (value < 10 || value > 2000) {
      setTimeDelayError('Time delay must be between 10 and 2000 milliseconds.');
    } else {
      setTimeDelayError('');
    }
  };

  const startGeneration = () => {
    const rowNum = rows === '' ? 10 : Number(rows);
    const colNum = cols === '' ? 10 : Number(cols);
    const delay = timeDelay === '' ? 200 : Number(timeDelay);

    if (rowsError || colsError || timeDelayError || rowNum < 10 || rowNum > 80 || colNum < 10 || colNum > 80 || delay < 10 || delay > 2000) {
      setErrorMessage('Please fix the errors before generating the maze.');
      setOpenSnackbar(true);
    } else {
      setErrorMessage(''); // Clear any previous errors
      setOpenSnackbar(false); // Close the Snackbar
      setIsGenerating(true);
    }
  };

  const fetchReport = () => {
    fetch('http://localhost:3003/api/generate-report')
      .then(response => response.json())
      .then(data => {
        console.log('Report fetched:', data);
        setReportData(data); // Set the report data in state
      })
      .catch(error => {
        console.error('Failed to fetch report:', error);
        setErrorMessage('Failed to fetch report.');
        setOpenSnackbar(true);
      });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage(''); // Clear error message after closing the Snackbar
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: pink[50], borderRadius: 2, textAlign: "center" }}>
      <TextField
        label="Rows"
        type="number"
        value={rows}
        onChange={handleRowsChange}
        error={!!rowsError}
        helperText={rowsError}
        sx={{ marginRight: 2 }}
        inputProps={{ min: 10, max: 80 }}
      />
      <TextField
        label="Columns"
        type="number"
        value={cols}
        onChange={handleColsChange}
        error={!!colsError}
        helperText={colsError}
        sx={{ marginRight: 2 }}
        inputProps={{ min: 10, max: 80 }}
      />
      <TextField
        label="Time Delay (ms)"
        type="number"
        value={timeDelay}
        onChange={handleTimeDelayChange}
        error={!!timeDelayError}
        helperText={timeDelayError}
        sx={{ marginRight: 2 }}
        inputProps={{ min: 10, max: 2000 }}
        disabled={isGenerating || renderingPath} // Disable while generating or rendering path
      />
      <Button 
        onClick={startGeneration} 
        disabled={isGenerating} 
        variant="contained" 
        sx={{ 
          backgroundColor: purple[200], color: "#ffffff",
          '&:hover': { backgroundColor: purple[100] },
          fontFamily: 'times new roman',
          borderRadius: 2,
          padding: '10px 20px',
          marginBottom: 4,
        }}
      >
        {isGenerating ? 'Generating Maze...' : 'Generate Maze'}
      </Button>
      <Button 
        onClick={fetchReport} 
        variant="contained" 
        sx={{ 
          backgroundColor: purple[200], color: "#ffffff",
          '&:hover': { backgroundColor: purple[100] },
          fontFamily: 'times new roman',
          borderRadius: 2,
          padding: '10px 20px',
          marginBottom: 4,
          marginLeft: 10,
        }}
      >
        Fetch Report
      </Button>
      <Box sx={{ display: "flex", justifyContent: "space-around", flexDirection: "row", alignItems: "flex-start" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: 'center' }}>
          <Typography variant="h4" sx={{ color: purple[800], marginBottom: 2 }}>
            Kruskal's Algorithm Maze
          </Typography>
          {mazeKruskal.length > 0 && <Maze key={`${mazeKey}-kruskal`} maze={mazeKruskal} path={pathKruskal} timeDelay={timeDelay} showDeadEndCounter />} 
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: 'center' }}>
          <Typography variant="h4" sx={{ color: purple[800], marginBottom: 2 }}>
            Prim's Algorithm Maze
          </Typography>
          {mazePrim.length > 0 && <Maze key={`${mazeKey}-prim`} maze={mazePrim} path={pathPrim} timeDelay={timeDelay} showDeadEndCounter />} 
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-around", flexDirection: "row", alignItems: "flex-start", marginTop: 4, textAlign: "left" }}>
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
        {reportData && (
          <Box sx={{ backgroundColor: pink[100], padding: 2, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" sx={{ color: purple[700], marginBottom: 1 }}>
            Maze Generation Report
          </Typography>
          {reportData && (
            <div>
              <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                Prim Algorithm:
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 0.5 }}>
                Average Number of Intersections: {reportData.Prim.numIntersections.toFixed(2)}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 0.5 }}>
                Average Number of Dead Ends: {reportData.Prim.numDeadEnds.toFixed(2)}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 0.5 }}>
                Average Number of Steps: {reportData.Prim.numSteps.toFixed(2)}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 0.5 }}>
                Average Number of Visited Intersections: {reportData.Prim.numVisitedIntersections.toFixed(2)}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 0.5 }}>
                Average Number of Visited Dead Ends: {reportData.Prim.numVisitedDeadEnds.toFixed(2)}
              </Typography>
              
              <Typography variant="subtitle1" sx={{ marginBottom: 1, marginTop: 2 }}>
                Kruskal Algorithm:
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 0.5 }}>
                Average Number of Intersections: {reportData.Kruskal.numIntersections.toFixed(2)}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 0.5 }}>
                Average Number of Dead Ends: {reportData.Kruskal.numDeadEnds.toFixed(2)}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 0.5 }}>
                Average Number of Steps: {reportData.Kruskal.numSteps.toFixed(2)}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 0.5 }}>
                Average Number of Visited Intersections: {reportData.Kruskal.numVisitedIntersections.toFixed(2)}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 0.5 }}>
                Average Number of Visited Dead Ends: {reportData.Kruskal.numVisitedDeadEnds.toFixed(2)}
              </Typography>
            </div>
          )}
        </Box>
        
        )}
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={errorMessage ? 'error' : 'info'} sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MazeGenerator;

import React, { useState, useEffect } from 'react';
import Maze from './Maze';
import { Box, Button, Typography, TextField, Snackbar, Alert } from '@mui/material';
import { pink, purple } from '@mui/material/colors';

function MazeVisualizer() {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [maze, setMaze] = useState([]);
  const [rows, setRows] = useState(20);
  const [cols, setCols] = useState(20);
  const [rowsError, setRowsError] = useState('');
  const [colsError, setColsError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (steps.length > 0) {
      setMaze(steps[currentStep]);
    }
  }, [currentStep, steps]);

  const fetchMazeSteps = async (algorithm) => {
    setIsGenerating(true);
    try {
      const response = await fetch(`http://localhost:3003/api/generate-maze-step-by-step?algorithm=${algorithm}&rows=${rows}&cols=${cols}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSteps(data.steps);
      setCurrentStep(0);
    } catch (error) {
      console.error('Failed to fetch steps:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const nextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

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

  const startGeneration = (algorithm) => {
    if (rowsError || colsError) {
      setErrorMessage('Please fix the errors before proceeding.');
      setOpenSnackbar(true);
      return;
    }
    fetchMazeSteps(algorithm);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ textAlign: 'center', padding: 4, backgroundColor: pink[50], borderRadius: 2 }}>
      <Typography variant="h4" sx={{ color: purple[800], marginBottom: 4 }}>
        Maze Visualizer
      </Typography>
      <Box sx={{ marginBottom: 4 }}>
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
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 4 }}>
        <Button 
          onClick={() => startGeneration('kruskal')} 
          disabled={isGenerating} 
          variant="contained" 
          sx={{ 
            backgroundColor: purple[200], color: "#ffffff",
            '&:hover': { backgroundColor: purple[100] },
            fontFamily: 'Times New Roman',
            borderRadius: 2,
            padding: '10px 20px',
          }}
        >
          {isGenerating ? 'Generating Kruskal Maze...' : 'Generate Kruskal Maze Step-by-Step'}
        </Button>
        <Button 
          onClick={() => startGeneration('prim')} 
          disabled={isGenerating} 
          variant="contained" 
          sx={{ 
            backgroundColor: purple[200], color: "#ffffff",
            '&:hover': { backgroundColor: purple[100] },
            fontFamily: 'Times New Roman',
            borderRadius: 2,
            padding: '10px 20px',
          }}
        >
          {isGenerating ? 'Generating Prim Maze...' : 'Generate Prim Maze Step-by-Step'}
        </Button>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-around", flexDirection: "row", alignItems: "flex-start" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: 'center' }}>
          
          {maze.length > 0 && <Maze maze={maze} />}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 4 }}>
        <Button 
          onClick={prevStep} 
          variant="contained" 
          sx={{ 
            backgroundColor: purple[200], color: "#ffffff",
            '&:hover': { backgroundColor: purple[100] },
            fontFamily: 'Times New Roman',
            borderRadius: 2,
            padding: '10px 20px',
          }}
        >
          Previous Step
        </Button>
        <Button 
          onClick={nextStep} 
          variant="contained" 
          sx={{ 
            backgroundColor: purple[200], color: "#ffffff",
            '&:hover': { backgroundColor: purple[100] },
            fontFamily: 'Times New Roman',
            borderRadius: 2,
            padding: '10px 20px',
          }}
        >
          Next Step
        </Button>
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default MazeVisualizer;

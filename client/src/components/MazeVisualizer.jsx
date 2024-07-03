import React, { useState, useEffect } from 'react';
import Maze from './Maze';
import { Box, Button, Typography, TextField } from '@mui/material';
import { pink, purple } from '@mui/material/colors';

function MazeVisualizer() {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [maze, setMaze] = useState([]);
  const [rows, setRows] = useState(20);
  const [cols, setCols] = useState(20);

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
          onChange={(e) => setRows(Math.max(10, Math.min(80, Number(e.target.value))))}  // Ensure minimum value of 1
          sx={{ marginRight: 2 }}
          inputProps={{ min: 10,max:80 }}  // Ensure min value in the UI
        />
        <TextField
          label="Columns"
          type="number"
          value={cols}
          onChange={(e) => setCols(Math.max(10, Math.min(80, Number(e.target.value))))}  // Ensure minimum value of 1
          sx={{ marginRight: 2 }}
          inputProps={{ min: 10,max:80}}  // Ensure min value in the UI
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 4 }}>
        <Button 
          onClick={() => fetchMazeSteps('kruskal')} 
          disabled={isGenerating} 
          variant="contained" 
          sx={{ 
            backgroundColor: purple[200], color:"#ffffff",
            '&:hover': { backgroundColor: purple[100] },
            fontFamily: 'times new roman',
            borderRadius: 2,
            padding: '10px 20px',
          }}
        >
          {isGenerating ? 'Generating Kruskal Maze...' : 'Generate Kruskal Maze Step-by-Step'}
        </Button>
        <Button 
          onClick={() => fetchMazeSteps('prim')} 
          disabled={isGenerating} 
          variant="contained" 
          sx={{ 
            backgroundColor: purple[200], color:"#ffffff",
            '&:hover': { backgroundColor: purple[100] },
            fontFamily: 'times new roman',
            borderRadius: 2,
            padding: '10px 20px',
          }}
        >
          {isGenerating ? 'Generating Prim Maze...' : 'Generate Prim Maze Step-by-Step'}
        </Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 4 }}>
        <Maze maze={maze} />
      </Box>
      {steps.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            onClick={prevStep} 
            disabled={currentStep === 0} 
            variant="contained" 
            sx={{ 
              backgroundColor: purple[200], color:"#ffffff",
              '&:hover': { backgroundColor: purple[100] },
              fontFamily: 'times new roman',
              borderRadius: 2,
              padding: '10px 20px',
            }}
          >
            Previous Step
          </Button>
          <Button 
            onClick={nextStep} 
            disabled={currentStep === steps.length - 1} 
            variant="contained" 
            sx={{ 
              backgroundColor: purple[200], color:"#ffffff",
              '&:hover': { backgroundColor: purple[100] },
              fontFamily: 'times new roman',
              borderRadius: 2,
              padding: '10px 20px',
            }}
          >
            Next Step
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default MazeVisualizer;

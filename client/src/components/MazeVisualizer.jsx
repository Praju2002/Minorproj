import React, { useState, useEffect } from 'react';
import Maze from './Maze';
import { Box, Button, Typography } from '@mui/material';
import { pink, purple } from '@mui/material/colors';

function MazeVisualizer() {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [maze, setMaze] = useState([]);

  useEffect(() => {
    if (steps.length > 0) {
      setMaze(steps[currentStep]);
    }
  }, [currentStep, steps]);

  const fetchMazeSteps = async (algorithm) => {
    setIsGenerating(true);
    const response = await fetch(`http://localhost:3003/api/generate-maze-step-by-step?algorithm=${algorithm}`);
    const data = await response.json();
    setSteps(data.steps);
    setCurrentStep(0);
    setIsGenerating(false);
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
              backgroundColor: purple[200], 
              '&:hover': { backgroundColor: purple[400] },
              borderRadius: 2,
              padding: '5px 10px',
            }}
          >
            Previous Step
          </Button>
          <Button 
            onClick={nextStep} 
            disabled={currentStep === steps.length - 1} 
            variant="contained" 
            sx={{ 
              backgroundColor: purple[200], 
              '&:hover': { backgroundColor: purple[400] },
              borderRadius: 2,
              padding: '5px 10px',
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

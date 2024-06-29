import React, { useState, useEffect } from 'react';
import Maze from './Maze';

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
    <div>
      <button onClick={() => fetchMazeSteps('kruskal')} disabled={isGenerating}>
        {isGenerating ? 'Generating Kruskal Maze...' : 'Generate Kruskal Maze Step-by-Step'}
      </button>
      <button onClick={() => fetchMazeSteps('prim')} disabled={isGenerating}>
        {isGenerating ? 'Generating Prim Maze...' : 'Generate Prim Maze Step-by-Step'}
      </button>
      <div>
        <Maze maze={maze} />
      </div>
      {steps.length > 0 && (
        <div>
          <button onClick={prevStep} disabled={currentStep === 0}>Previous Step</button>
          <button onClick={nextStep} disabled={currentStep === steps.length - 1}>Next Step</button>
        </div>
      )}
    </div>
  );
}

export default MazeVisualizer;

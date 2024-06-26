import React, { useState } from 'react';
import Maze from '../components/Maze';

function Homepage() {
  const [maze, setMaze] = useState(null);
  const [metrics, setMetrics] = useState(null);

  const generateMaze = async (algorithm) => {
    const response = await fetch('http://localhost:5003/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ algorithm, rows: 10, cols: 10 }),
    });
    const data = await response.json();
    setMaze(data.maze);
    setMetrics(data.metrics);
  };
  

  return (
    <div>
      <button onClick={() => generateMaze('kruskal')}>Generate Kruskal Maze</button>
      <button onClick={() => generateMaze('prim')}>Generate Prim Maze</button>
      {maze && <Maze maze={maze} />}
      {metrics && (
        <div>
          <h2>Performance Metrics</h2>
          <p>Number of Intersections (Ni): {metrics.Ni}</p>
          <p>Number of Dead Ends (Nd): {metrics.Nd}</p>
          <p>Number of Steps (Ns): {metrics.Ns}</p>
          <p>Number of Visited Intersections (Vi): {metrics.Vi}</p>
          <p>Number of Visited Dead Ends (Vde): {metrics.Vde}</p>
        </div>
      )}
    </div>
  );
}

export default Homepage;

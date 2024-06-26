import React from "react";
import "./maze.css";

function Maze({ maze }) {
  if (!maze || maze.length === 0) {
    return <div>No maze data available.</div>;
  }

  return (
    <div className="maze-container" style={{ gridTemplateColumns: `repeat(${maze[0].length}, 20px)` }}>
      {maze.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`maze-cell ${cell === 0 ? "wall" : ""}`}
          ></div>
        ))
      )}
    </div>
  );
}

export default Maze;

import React from "react";
import "./maze.css";

function Maze({ maze }) {
  if (!maze || maze.length === 0) {
    return <div>No maze data available.</div>;
  }
// console.log(maze);

  return (
    <div className="maze-container" style={{ gridTemplateColumns: `repeat(${maze[0].length}, 20px)` }}>
      {maze.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isWallTop = (cell & 1) === 0;
          const isWallBottom = (cell & 2) === 0;
          const isWallLeft = (cell & 4) === 0;
          const isWallRight = (cell & 8) === 0;
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="maze-cell"
              style={{
                borderTop: isWallTop ? '2px solid #000' : 'none',
                borderBottom: isWallBottom ? '2px solid #000' : 'none',
                borderLeft: isWallLeft ? '2px solid #000' : 'none',
                borderRight: isWallRight ? '2px solid #000' : 'none',
              }}
            />
          );
        })
      )}
    </div>
  );
};

export default Maze;
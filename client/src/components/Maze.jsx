import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./maze.css";

function Maze({ maze, path, deadEndCount }) {
  const svgRef = useRef();
  const cellSize = 20;

  useEffect(() => {
    if (!maze || maze.length === 0) {
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const mazeGroup = svg.append("g").attr("class", "maze-group");

    maze.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const x = colIndex * cellSize;
        const y = rowIndex * cellSize;
        const isWallTop = (cell & 1) === 0;
        const isWallBottom = (cell & 2) === 0;
        const isWallLeft = (cell & 4) === 0;
        const isWallRight = (cell & 8) === 0;

        if (isWallTop) {
          mazeGroup.append("line")
            .attr("x1", x)
            .attr("y1", y)
            .attr("x2", x + cellSize)
            .attr("y2", y)
            .attr("stroke", "black")
            .attr("stroke-width", 2);
        }
        if (isWallBottom) {
          mazeGroup.append("line")
            .attr("x1", x)
            .attr("y1", y + cellSize)
            .attr("x2", x + cellSize)
            .attr("y2", y + cellSize)
            .attr("stroke", "black")
            .attr("stroke-width", 1);
        }
        if (isWallLeft) {
          mazeGroup.append("line")
            .attr("x1", x)
            .attr("y1", y)
            .attr("x2", x)
            .attr("y2", y + cellSize)
            .attr("stroke", "black")
            .attr("stroke-width", 1);
        }
        if (isWallRight) {
          mazeGroup.append("line")
            .attr("x1", x + cellSize)
            .attr("y1", y)
            .attr("x2", x + cellSize)
            .attr("y2", y + cellSize)
            .attr("stroke", "black")
            .attr("stroke-width", 1);
        }
      });
    });

    // Function to simulate delayed rendering
    const renderPathSlowly = (path, color, strokeWidth) => {
      return new Promise(resolve => {
        const pathGroup = svg.append("g").attr("class", "path-group");
        path.forEach((point, index) => {
          const [x, y] = [point[1] * cellSize + cellSize / 2, point[0] * cellSize + cellSize / 2];

          setTimeout(() => {
            pathGroup.append("circle")
              .attr("cx", x)
              .attr("cy", y)
              .attr("r", 2)
              .attr("fill", color); // Simulate drawing with circles for visualization
            if (index < path.length - 1) {
              const nextPoint = path[index + 1];
              const [nextX, nextY] = [nextPoint[1] * cellSize + cellSize / 2, nextPoint[0] * cellSize + cellSize / 2];
              pathGroup.append("line")
                .attr("x1", x)
                .attr("y1", y)
                .attr("x2", nextX)
                .attr("y2", nextY)
                .attr("stroke", color)
                .attr("stroke-width", strokeWidth);
            }
            if (index === path.length - 1) {
              resolve(); // Resolve the promise when the last line is drawn
            }
          }, index * 600); // Adjust the delay (600ms here) for desired speed
        });
      });
    };

    // Render path with delay
    if (path && path.length > 0) {
      renderPathSlowly(path, "blue", 2);
    }

  }, [maze, path]);

  if (!maze || maze.length === 0) {
    return <div>No maze data available.</div>;
  }

  return (
    <div className="maze-container">
      <svg ref={svgRef} width={maze[0].length * cellSize} height={maze.length * cellSize} />
      {deadEndCount !== undefined && (
        <div className="dead-end-count">
          Dead Ends Visited: {deadEndCount}
        </div>
      )}
    </div>
  );
}

export default Maze;

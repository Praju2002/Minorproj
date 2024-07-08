import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./maze.css";

function Maze({ maze, path, timeDelay }) {
  const svgRef = useRef();
  const [visitedDeadEndCount, setVisitedDeadEndCount] = useState(0);
  const cellSize = 20;
  const visitedDeadEnds = useRef(new Set());

  const isDeadEnd = (r, c) => {
    const cell = maze[r][c];
    let exits = 0;
    if ((cell & 1) !== 0 && r > 0) exits++; // Top
    if ((cell & 2) !== 0 && r < maze.length - 1) exits++; // Bottom
    if ((cell & 4) !== 0 && c > 0) exits++; // Left
    if ((cell & 8) !== 0 && c < maze[0].length - 1) exits++; // Right
    return exits === 1;
  };

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
      } });
    });

    const renderPathSlowly = (path, color, strokeWidth) => {
      return new Promise((resolve) => {
        const pathGroup = svg.append("g").attr("class", "path-group");
        path.forEach((point, index) => {
          const [x, y] = [point[1] * cellSize + cellSize / 2, point[0] * cellSize + cellSize / 2];

          setTimeout(() => {
            pathGroup.append("circle")
              .attr("cx", x)
              .attr("cy", y)
              .attr("r", 2)
              .attr("fill", color);

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

            // Check if the current cell is a dead end and hasn't been visited yet
            const cellKey = `${point[0]}-${point[1]}`;
            if (isDeadEnd(point[0], point[1]) && !visitedDeadEnds.current.has(cellKey)) {
              visitedDeadEnds.current.add(cellKey); // Mark cell as visited
              setVisitedDeadEndCount(prevCount => prevCount + 1); // Increment visited dead end count
            }

            if (index === path.length - 1) {
              resolve();
            }
          }, index * timeDelay);
        });
      });
    };

    if (path && path.length > 0) {
      renderPathSlowly(path, "blue", 2);
    }

  }, [maze, path, timeDelay]);

  if (!maze || maze.length === 0) {
    return <div>No maze data available.</div>;
  }

  return (
    <div className="maze-container">
      <svg ref={svgRef} width={maze[0].length * cellSize} height={maze.length * cellSize} />
      <div className="visited-dead-end-counter">Visited Dead Ends: {visitedDeadEndCount}</div>
    </div>
  );
}

export default Maze;

const { UnionFind } = require("./unionFind");
const { connectDB } = require("../../db");

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getDirection(dr, dc) {
  if (dr === -1) return 1;
  if (dr === 1) return 2;
  if (dc === -1) return 4;
  if (dc === 1) return 8;
  return 0;
}

async function storeMetricsInDB(metrics, algorithm) {
  const db = await connectDB();
  const collection = db.collection("mazeMetrics");
  await collection.insertOne({ ...metrics, algorithm, createdAt: new Date() });
}

async function calculateMetrics(maze, algorithm) {
  if (
    !maze ||
    !Array.isArray(maze) ||
    maze.length === 0 ||
    !Array.isArray(maze[0])
  ) {
    throw new Error("Invalid maze input");
  }
  let numIntersections = 0;
  let numDeadEnds = 0;

  const rows = maze.length;
  const cols = maze[0].length;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = maze[r][c];
      const neighbors = countNeighbors(cell);

      if (neighbors > 2) numIntersections++;
      if (neighbors === 1) numDeadEnds++;
    }
  }

  const {
    numSteps,
    numVisitedIntersections,
    numVisitedDeadEnds,
    path,
    finalPathStack,
    backtrackPath,
  } = heuristicDFS(maze);

  const metrics = {
    numIntersections,
    numDeadEnds,
    numSteps,
    numVisitedIntersections,
    numVisitedDeadEnds,
    path,
    finalPathStack, 
    backtrackPath,
  };

  await storeMetricsInDB(metrics, algorithm);

  return metrics;
}

async function generateMazeKruskal(rows, cols) {
  const maze = Array.from({ length: rows }, () => Array(cols).fill(0));
  const walls = [];
  const steps = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r < rows - 1) walls.push([r, c, r + 1, c]);
      if (c < cols - 1) walls.push([r, c, r, c + 1]);
    }
  }

  shuffleArray(walls);
  const uf = new UnionFind(rows * cols);

  for (const [r1, c1, r2, c2] of walls) {
    const cell1 = r1 * cols + c1;
    const cell2 = r2 * cols + c2;

    if (!uf.connected(cell1, cell2)) {
      uf.union(cell1, cell2);
      maze[r1][c1] |= getDirection(r2 - r1, c2 - c1);
      maze[r2][c2] |= getDirection(r1 - r2, c1 - c2);
      steps.push(JSON.parse(JSON.stringify(maze)));
    }
  }

  const metrics = await calculateMetrics(maze, "Kruskal");
  console.log("Final path stack for Kruskal:", metrics.finalPathStack);
  return { maze, steps, finalPathStack: metrics.finalPathStack, ...metrics }; 
}

function addWalls(r, c, walls, visited, rows, cols) {
  if (r > 0 && !visited[r - 1][c]) walls.push([r, c, r - 1, c]);
  if (r < rows - 1 && !visited[r + 1][c]) walls.push([r, c, r + 1, c]);
  if (c > 0 && !visited[r][c - 1]) walls.push([r, c, r, c - 1]);
  if (c < cols - 1 && !visited[r][c + 1]) walls.push([r, c, r, c + 1]);
}

async function generateMazePrim(rows, cols) {
  const maze = Array.from({ length: rows }, () => Array(cols).fill(0));
  const walls = [];
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const steps = [];
  const startRow = Math.floor(Math.random() * rows);
  const startCol = Math.floor(Math.random() * cols);

  visited[startRow][startCol] = true;
  addWalls(startRow, startCol, walls, visited, rows, cols);

  while (walls.length > 0) {
    const [r, c, nr, nc] = walls.splice(
      Math.floor(Math.random() * walls.length),
      1
    )[0];

    if (!visited[nr][nc]) {
      visited[nr][nc] = true;
      maze[r][c] |= getDirection(nr - r, nc - c);
      maze[nr][nc] |= getDirection(r - nr, c - nc);
      addWalls(nr, nc, walls, visited, rows, cols);
      steps.push(JSON.parse(JSON.stringify(maze)));
    }
  }

  const metrics = await calculateMetrics(maze, "Prim");
  console.log("Final path stack for Prim:", metrics.finalPathStack);
  return { maze, steps, finalPathStack: metrics.finalPathStack, ...metrics }; 
}

function heuristicDFS(maze) {
  const rows = maze.length;
  const cols = maze[0].length;
  const start = [0, 0];
  const end = [rows - 1, cols - 1];
  const stack = [[...start, 0]]; 
  const finalPathStack = []; 
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  visited[0][0] = true;
  let numSteps = 0;
  let numVisitedIntersections = 0;
  let numVisitedDeadEnds = 0;
  const path = []; 
  const backtrackPath = [];
  const parent = {}; 

  
  const isDeadEnd = (r, c) => {
    const cell = maze[r][c];
    let exits = 0;
    if ((cell & 1) !== 0 && r > 0) exits++; 
    if ((cell & 2) !== 0 && r < rows - 1) exits++; 
    if ((cell & 4) !== 0 && c > 0) exits++; 
    if ((cell & 8) !== 0 && c < cols - 1) exits++; 
    return exits === 1; 
  };

  
  const heuristic = (r, c) => Math.abs(r - end[0]) + Math.abs(c - end[1]);

  while (stack.length > 0) {
    const current = stack.pop();
    const [r, c] = current;
    path.push([r, c]); 
    numSteps++;
    const cell = maze[r][c];
    const neighbors = getNeighbors(cell, r, c, rows, cols, visited);

    if (neighbors.length >= 2) numVisitedIntersections++; 
    if (isDeadEnd(r, c)) numVisitedDeadEnds++; 

    
    if (r === end[0] && c === end[1]) {
      let [pr, pc] = [r, c];
      while (pr !== 0 || pc !== 0) {
        finalPathStack.push([pr, pc]);
        [pr, pc] = parent[[pr, pc]]; 
      }
      finalPathStack.push(start); 
      return {
        numSteps,
        numVisitedIntersections,
        numVisitedDeadEnds,
        path, 
        finalPathStack: finalPathStack.reverse(), 
        backtrackPath,
      };
    }

    if (neighbors.length === 0) {
      backtrackPath.push([r, c]); 
    }

    neighbors.forEach(([nr, nc]) => {
      if (!visited[nr][nc]) {
        visited[nr][nc] = true;
        parent[[nr, nc]] = [r, c]; 
        const heuristicValue = heuristic(nr, nc);
        let inserted = false;
        for (let i = stack.length - 1; i >= 0; i--) {
          if (stack[i][2] > heuristicValue) {
            stack.splice(i + 1, 0, [nr, nc, heuristicValue]);
            inserted = true;
            break;
          }
        }
        if (!inserted) stack.unshift([nr, nc, heuristicValue]); 
      }
    });
  }

  return {
    numSteps,
    numVisitedIntersections,
    numVisitedDeadEnds,
    path,
    finalPathStack,
    backtrackPath,
  };
}

function getNeighbors(cell, r, c, rows, cols, visited) {
  const neighbors = [];
  if ((cell & 1) !== 0 && r > 0 && !visited[r - 1][c])
    neighbors.push([r - 1, c]); 
  if ((cell & 2) !== 0 && r < rows - 1 && !visited[r + 1][c])
    neighbors.push([r + 1, c]); 
  if ((cell & 4) !== 0 && c > 0 && !visited[r][c - 1])
    neighbors.push([r, c - 1]); 
  if ((cell & 8) !== 0 && c < cols - 1 && !visited[r][c + 1])
    neighbors.push([r, c + 1]); 
  return neighbors;
}

function countNeighbors(cell) {
  let neighbors = 0;
  if ((cell & 1) !== 0) neighbors++; 
  if ((cell & 2) !== 0) neighbors++; 
  if ((cell & 4) !== 0) neighbors++; 
  if ((cell & 8) !== 0) neighbors++; 
  return neighbors;
}

module.exports = {
  generateMazeKruskal,
  generateMazePrim,
};

const { UnionFind } = require("./unionFind");

// Utility function to shuffle an array
function shuffleArray(array) {
  //fisher yates shuffle algorithm
  for (let i = array.length - 1; i > 0; i--) {
    //loop through array from last element to first i vaneko array ko index ho
    const j = Math.floor(Math.random() * (i + 1)); //js ma math.random le 0 to 1 smth nikalxa like 0.45 etc teslai aaile jun current element ko index xa tyo vanda next le multipy garne ani floor value line
    [array[i], array[j]] = [array[j], array[i]]; //aba tyo index ma vako elements swap garne
  }
  return array;
}

// Utility function to get the direction
function getDirection(dr, dc) {
  //dr row difference dc column difference
  if (dr === -1) return 1; // Up
  if (dr === 1) return 2; // Down
  if (dc === -1) return 4; // Left
  if (dc === 1) return 8; // Right
  return 0;
}

// Kruskal's Algorithm for maze generation
function generateMazeKruskal(rows, cols) {
  const maze = Array.from({ length: rows }, () => Array(cols).fill(0));
  const walls = [];
  const steps = [];

  for (let r = 0; r < rows; r++) {
    //iterate over each row
    for (let c = 0; c < cols; c++) {
      //iterate over each column of that row
      if (r < rows - 1) walls.push([r, c, r + 1, c]); //r<rows-1 check if its not last row if haina vane wall rakhxa between it and cell directly below it
      if (c < cols - 1) walls.push([r, c, r, c + 1]); //right ma
    }
  }

  shuffleArray(walls); //walls ko order random garxa so that everytime naya wall select hos
  const uf = new UnionFind(rows * cols); //avoid cycles

  for (const [r1, c1, r2, c2] of walls) {
    const cell1 = r1 * cols + c1; //2d lai 1d value ma change gareko cell ko
    const cell2 = r2 * cols + c2;

    if (!uf.connected(cell1, cell2)) {
      //connected vaneko same root(same parent) ho or not
      uf.union(cell1, cell2); //duita connected haina vane connect garne ani wall remove garne
      maze[r1][c1] |= getDirection(r2 - r1, c2 - c1); //direction set garxa like up bit esle grda cell ko position track hunxa ani direction dinxa where cell is connected
      maze[r2][c2] |= getDirection(r1 - r2, c1 - c2);
      steps.push(JSON.parse(JSON.stringify(maze))); // save each stage of maze of maze generation like up down matra haina right tira ni connect huna sakxa tetikhera updown ko ni value huna parxa
    }
  }
  // Remove walls for starting point (0,0)
  maze[0][0] = 14; //15 vaneko binary ma 111 ho so like up bahek sab wall remove gareko
  // Remove walls for ending point (rows-1, cols-1)
  maze[rows - 1][cols - 1] = 13;
  return { maze, steps };
}

// Utility function to add walls around a cell
function addWalls(r, c, walls, visited, rows, cols) {
  if (r > 0 && !visited[r - 1][c]) walls.push([r, c, r - 1, c]); //top neighbour visit vaxa ki nai check gareko if not it adds [r, c, r - 1, c] to walls, indicating a potential wall between the current cell (r, c) and its top neighbor (r - 1, c).
  if (r < rows - 1 && !visited[r + 1][c]) walls.push([r, c, r + 1, c]); //bottom
  if (c > 0 && !visited[r][c - 1]) walls.push([r, c, r, c - 1]); //left
  if (c < cols - 1 && !visited[r][c + 1]) walls.push([r, c, r, c + 1]); //right
}

// Prim's Algorithm for maze generation
function generateMazePrim(rows, cols) {
  const maze = Array.from({ length: rows }, () => Array(cols).fill(0));
  const walls = [];
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const steps = [];
  const startRow = Math.floor(Math.random() * rows);
  const startCol = Math.floor(Math.random() * cols);

  visited[startRow][startCol] = true;
  addWalls(startRow, startCol, walls, visited, rows, cols);

  while (walls.length > 0) {
    //when there are walls in walls array
    const [r, c, nr, nc] = walls.splice(
      Math.floor(Math.random() * walls.length),
      1
    )[0]; // so walls ma wall ko coordinate hunxa (r c    nr nc) splice le euta wall randomly choose garera hatauxa ani tyo wall ko coordinate (r c nc nr ma) pathauxa

    if (!visited[nr][nc]) {
      visited[nr][nc] = true;
      maze[r][c] |= getDirection(nr - r, nc - c); //update maze at cell r,c with value getDirection(nr - r, nc - c) remove wall or set direction between r c and nr nc
      maze[nr][nc] |= getDirection(r - nr, c - nc); //duita cell lai same number ani remove wall wala concept
      //remove wall getdirection le chai kun direction ko wall vanxa
      addWalls(nr, nc, walls, visited, rows, cols); //Adds potential walls around a given cell (r, c) to the walls array based on neighboring cells that have not been visited yet.
      steps.push(JSON.parse(JSON.stringify(maze)));
    }
  }

  // Remove walls for starting point (0,0)
  maze[0][0] = 14;

  // Remove walls for ending point (rows-1, cols-1)
  maze[rows - 1][cols - 1] = 13;
  return { maze, steps };
}

function heuristicDFS(maze) {
  const rows = maze.length;
  const cols = maze[0].length;
  const start = [0, 0];
  const end = [rows - 1, cols - 1];
  const stack = [start];
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false)); //all cells visited false
  visited[0][0] = true; //starting point visited true
  let numSteps = 0;
  let numVisitedIntersections = 0;
  let numVisitedDeadEnds = 0;
  //if deadend pop the stack to backtrack to previous cell with univisted neighbours
  while (stack.length > 0) {
    const [r, c] = stack.pop(); //pop top cell of stack
    numSteps++;
    const cell = maze[r][c]; //retrieve current cell from maze
    const neighbors = getNeighbors(cell, r, c, rows, cols, visited); //get list of neighbouring cells not yet visited

    if (neighbors.length > 2) numVisitedIntersections++;
    if (neighbors.length === 1) numVisitedDeadEnds++;

    for (const [nr, nc] of neighbors) {
      if (!visited[nr][nc]) {
        visited[nr][nc] = true;
        stack.push([nr, nc]);
      }
    }

    if (r === end[0] && c === end[1]) break;
  }

  return { numSteps, numVisitedIntersections, numVisitedDeadEnds };
}

function getNeighbors(cell, r, c, rows, cols, visited) {
  const neighbors = [];
  if (cell & 1 && r > 0 && !visited[r - 1][c]) neighbors.push([r - 1, c]);
  if (cell & 2 && r < rows - 1 && !visited[r + 1][c])
    neighbors.push([r + 1, c]);
  if (cell & 4 && c > 0 && !visited[r][c - 1]) neighbors.push([r, c - 1]);
  if (cell & 8 && c < cols && !visited[r][c + 1]) neighbors.push([r, c + 1]);
  return neighbors;
}

function countNeighbors(cell) {
  let count = 0;
  if (cell & 1) count++;
  if (cell & 2) count++;
  if (cell & 4) count++;
  if (cell & 8) count++;
  return count;
}

function calculateMetrics(maze) {
  // console.log("Maze input to calculateMetrics:", maze);
  if (!maze || !Array.isArray(maze) || maze.length === 0 || !Array.isArray(maze[0])) {
    throw new Error('Invalid maze input');
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

  const { numSteps, numVisitedIntersections, numVisitedDeadEnds } =
    heuristicDFS(maze);

  return {
    numIntersections,
    numDeadEnds,
    numSteps,
    numVisitedIntersections,
    numVisitedDeadEnds,
  };
}

module.exports = {
  generateMazeKruskal,
  generateMazePrim,
  calculateMetrics,
};

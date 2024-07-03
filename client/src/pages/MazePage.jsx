// import React, { useState } from 'react';
// import axios from 'axios';
// import { Button, TextField, Typography, Grid } from '@mui/material';

// function MazePage() {
//   const [rows, setRows] = useState(10);
//   const [cols, setCols] = useState(10);
//   const [algorithm, setAlgorithm] = useState('kruskal');
//   const [maze, setMaze] = useState(null);
//   const [metrics, setMetrics] = useState(null);

//   const generateMaze = async () => {
//     try {
//       const response = await axios.post('http://localhost:3003/api/generate', {
//         rows,
//         cols,
//         algorithm,
//       });

//       setMaze(response.data.maze);
//       setMetrics(response.data.metrics);
//     } catch (error) {
//       console.error('Error generating maze:', error);
//     }
//   };

//   return (
//     <div>
//       <Typography variant="h4">Generate Maze</Typography>
//       <Grid container spacing={2}>
//         <Grid item xs={6}>
//           <TextField
//             label="Rows"
//             type="number"
//             value={rows}
//             onChange={(e) => setRows(e.target.value)}
//             fullWidth
//           />
//         </Grid>
//         <Grid item xs={6}>
//           <TextField
//             label="Columns"
//             type="number"
//             value={cols}
//             onChange={(e) => setCols(e.target.value)}
//             fullWidth
//           />
//         </Grid>
//       </Grid>
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={generateMaze}
//         style={{ marginTop: '20px' }}
//       >
//         Generate Maze
//       </Button>

//       {maze && (
//         <div>
//           <Typography variant="h5">Maze</Typography>
//           <Maze maze={maze} />
//         </div>
//       )}

//       {metrics && (
//         <div>
//           <Typography variant="h5">Metrics</Typography>
//           <Typography>Number of Intersections (Ni): {metrics.Ni}</Typography>
//           <Typography>Number of Dead Ends (Nd): {metrics.Nd}</Typography>
//           <Typography>Number of Steps (Ns): {metrics.Ns}</Typography>
//           <Typography>Number of Visited Intersections (Vi): {metrics.Vi}</Typography>
//           <Typography>Number of Visited Dead Ends (Vde): {metrics.Vde}</Typography>
//         </div>
//       )}
//     </div>
//   );
// }

// export default MazePage;
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import RootLayout from './layout/RootLayout';

import MazeGenerator from './components/MazeGenerator';
import MazeVisualizer from './components/MazeVisualizer';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<MazeGenerator />} />
            <Route path="maze" element={<MazeGenerator />} />
            <Route path="maze-visualizer" element={<MazeVisualizer />} />
            <Route path="*" element={<h1>Page not found</h1>} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

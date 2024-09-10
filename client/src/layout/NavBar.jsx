import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <>
      <AppBar position="fixed" sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.6)', 
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)'}}>
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, fontFamily: 'Roboto Slab',color:"#901b63" }}
          >
            Maze App
          </Typography>
          <Button 
            color="inherit" 
            component={Link} 
            to="/maze" 
            sx={{ fontFamily: 'Roboto Slab' }}
          >
            Maze
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/maze-visualizer" 
            sx={{ fontFamily: 'Roboto Slab' }}
          >
            Maze Visualizer
          </Button>
        </Toolbar>
      </AppBar>
     
      <Box sx={{ mt: 8 }}>
        
      </Box>
    </>
  );
}

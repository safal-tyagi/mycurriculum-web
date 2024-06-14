// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText, CssBaseline, TextField, InputAdornment, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CourseList from './components/CourseList';
import ChapterContent from './components/ChapterContent';

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Router>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component={Link} to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            My Curriculum
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <TextField
            variant="outlined"
            placeholder="Search courses"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: { height: '36px', width: '180px' },
            }}
            sx={{ ml: 2, bgcolor: 'background.paper', borderRadius: 1 }}
          />
        </Toolbar>
      </AppBar>
      <Drawer open={drawerOpen} onClose={handleDrawerToggle}>
        <List>
          {/* Add navigation items here if needed */}
          <ListItem component={Link} to="/" onClick={handleDrawerToggle}>
            <ListItemText primary="Home" />
          </ListItem>
        </List>
      </Drawer>
      <Toolbar />
      <Routes>
        <Route path="/" element={<CourseList searchTerm={searchTerm} />} />
        <Route path="/course/:id/:chapter" element={<ChapterContent />} />
      </Routes>
    </Router>
  );
};

export default App;

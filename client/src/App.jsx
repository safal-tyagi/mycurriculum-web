import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box
} from '@mui/material';
import {
  Class,
} from '@mui/icons-material';
import Home from './features/courses/Home';
import CourseReader from './features/courses/CourseReader';

const App = () => {
  return (
    <Router>
      <AppBar position="fixed">
        <Toolbar>
          <Class sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Curriculum
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Box
        component="main"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          minHeight: '100vh',
        }}
      >
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/course/:courseId" element={<CourseReader />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
};

export default App;

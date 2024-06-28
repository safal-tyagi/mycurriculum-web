import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Home from './features/courses/Home';
import CourseReader from './features/courses/CourseReader';

const App = () => {
  return (
    <Router>
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/course/:courseId" element={<CourseReader />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;

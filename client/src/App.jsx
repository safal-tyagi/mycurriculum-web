import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
} from "react-router-dom";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { Class } from "@mui/icons-material";
import Home from "./features/courses/Home";
import CourseReader from "./features/courses/CourseReader";

const App = () => {
  return (
    <Router>
      <AppBar position="fixed">
        <Toolbar sx={{ width: "100%" }}>
          <RouterLink
            to="/"
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton edge="start" color="inherit">
              <Class sx={{ mr: 2 }} />
            </IconButton>
            <Typography variant="h6" component="div">
              My Curriculum
            </Typography>
          </RouterLink>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Box
        component="main"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <Container sx={{ alignSelf: "baseline" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/course/:courseId" element={<CourseReader />} />
            <Route
              path="/course/:courseId/:chapterNumber"
              element={<CourseReader />}
            />
            <Route
              path="/course/:courseId/:chapterNumber/:sectionNumber"
              element={<CourseReader />}
            />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
};

export default App;

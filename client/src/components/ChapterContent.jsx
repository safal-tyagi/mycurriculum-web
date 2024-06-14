// src/components/ChapterContent.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetCourseQuery } from '../features/courses/coursesSlice';
import { Drawer, List, ListItem, ListItemText, IconButton, AppBar, Toolbar, Typography, CssBaseline } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Button } from '@mui/material';

const ChapterContent = () => {
  const { id, chapter } = useParams();
  const { data: course, error, isLoading } = useGetCourseQuery(id);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Caching course progress
  useEffect(() => {
    const progress = JSON.parse(localStorage.getItem('courseProgress')) || {};
    progress[id] = chapter;
    localStorage.setItem('courseProgress', JSON.stringify(progress));
  }, [id, chapter]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const currentChapter = course.chapters.find(ch => ch.chapter_number === parseInt(chapter));

  return (
    <div>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component={Link} to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            My Curriculum
          </Typography>
          <Button variant="contained" color="primary" component={Link} to="/" style={{ marginLeft: 'auto' }}>
            Home
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer open={drawerOpen} onClose={handleDrawerToggle}>
        <List>
          {course.chapters.map(ch => (
            <ListItem key={ch.chapter_number} component={Link} to={`/course/${id}/${ch.chapter_number}`} onClick={handleDrawerToggle}>
              <ListItemText primary={`${ch.chapter_number}. ${ch.chapter_name}`} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Toolbar />
      <main>
        <h2>{currentChapter.chapter_name}</h2>
        {currentChapter.sections.map(section => (
          <div key={section.section_number}>
            <h4>{section.section_name}</h4>
            <p>{section.content}</p>
          </div>
        ))}
      </main>
    </div>
  );
};

export default ChapterContent;

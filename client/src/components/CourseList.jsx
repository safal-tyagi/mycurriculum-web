// src/components/CourseList.jsx
import React from 'react';
import { useGetCoursesQuery } from '../features/courses/coursesSlice';
import { Grid, Card, CardContent, Typography, Box, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const CourseList = ({ searchTerm }) => {
  const { data: courses, error, isLoading } = useGetCoursesQuery();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ mt: 2, flexGrow: 1 }}>
      <Grid container spacing={3} justifyContent={isMobile ? 'center' : 'flex-start'}>
        {filteredCourses.map((course) => (
          <Grid item key={course._id} xs={12} sm={6} md={6}>
            <Link to={`/course/${course._id}/1`}>
              <Card>
                <CardContent>
                  <Typography variant="h5">{course.name}</Typography>
                  <Typography>{course.highlights}</Typography>
                  <Typography>Level: {course.level}</Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CourseList;

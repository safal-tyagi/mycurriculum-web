import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  setSelectedCategory,
  setSelectedCourse,
  setSelectedLevel,
} from "./coursesSlice";
import { useGetCoursesQuery, useCreateCourseGPTMutation } from "./coursesApi";
import courseImage from "../../assets/course.png";
import "../../index.css";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    categories,
    courses,
    levels,
    selectedCategory,
    selectedCourse,
    selectedLevel,
  } = useSelector((state) => state.courses);
  const { data: courseList, isLoading } = useGetCoursesQuery();
  const [createCourseGPT, { isLoading: isCreating }] =
    useCreateCourseGPTMutation();
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    if (courseList) {
      let filtered = [...courseList].sort((a, b) => a.name.localeCompare(b.name));
      // if (selectedCategory) {
      //   filtered = filtered.filter(course => course.category === selectedCategory);
      // }
      if (selectedCourse) {
        filtered = filtered.filter((course) => course.name === selectedCourse);
      }
      if (selectedLevel) {
        filtered = filtered.filter((course) => course.level === selectedLevel);
      }
      setFilteredCourses(filtered);
    }
  }, [courseList, selectedCategory, selectedCourse, selectedLevel]);

  const handleFetchCourse = async () => {
    await createCourseGPT({ name: selectedCourse, level: selectedLevel });
  };

  const handleCardClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const courseExists = filteredCourses?.some(
    (course) => course.name === selectedCourse && course.level === selectedLevel
  );

  return (
    <Container>
      <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            size="small"
            value={selectedCategory}
            onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
          >
            <MenuItem value="">None</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Course</InputLabel>
          <Select
            size="small"
            value={selectedCourse}
            onChange={(e) => dispatch(setSelectedCourse(e.target.value))}
          >
            <MenuItem value="">None</MenuItem>
            {courses.map((course) => (
              <MenuItem key={course} value={course}>
                {course}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Level</InputLabel>
          <Select
            size="small"
            value={selectedLevel}
            onChange={(e) => dispatch(setSelectedLevel(e.target.value))}
          >
            <MenuItem value="">None</MenuItem>
            {levels.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      { selectedCourse && selectedLevel && !courseExists && (
        <Button variant="contained" color="primary" onClick={handleFetchCourse}>
          Generate Course
        </Button>
      )}

      {(isLoading || isCreating) && <CircularProgress />}
      <Typography variant="h5">Courses</Typography>
      <Grid container spacing={4}>
        {filteredCourses &&
          filteredCourses.map((course) => (
            <Grid item key={course._id} xs={12} sm={6} md={4} lg={3}>
              <Card
                className="card"
                onClick={() => handleCardClick(course._id)}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={
                    course.card_image
                      ? `data:image/png;base64,${course.card_image}`
                      : courseImage
                  }
                  alt={course.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {course.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.highlights}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Category: {course.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Level: {course.level}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
};

export default Home;

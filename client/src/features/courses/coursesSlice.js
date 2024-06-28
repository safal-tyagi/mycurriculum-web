import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCourse = createAsyncThunk('courses/fetchCourse', async ({ name, level }) => {
  const response = await axios.post('/api/create-course', { name, level });
  return response.data;
});

export const fetchSectionContent = createAsyncThunk('courses/fetchSectionContent', async ({ courseId, chapterNumber, sectionNumber }) => {
  const response = await axios.post(`/api/add-content/${courseId}/${chapterNumber}/${sectionNumber}`);
  return { chapterNumber, sectionNumber, content: response.data.content };
});

const coursesSlice = createSlice({
  name: 'courses',
  initialState: {
    categories: ['Computer Science'],
    courses: [
      'Data Structures & Algorithms',
      'Programming Languages',
      'Computer Networking',
      'Operating Systems',
      'Databases',
      'Frontend Development',
      'Backend Development',
      'Mobile Development',
      'Game Development',
      'Software Engineering',
      'Data Science',
      'Artificial Intelligence',
      'Cybersecurity',
    ],
    levels: ['Basic', 'Intermediate', 'Advanced'],
    selectedCategory: '',
    selectedCourse: '',
    selectedLevel: '',
    courseContent: null,
    loading: false,
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSelectedCourse: (state, action) => {
      state.selectedCourse = action.payload;
    },
    setSelectedLevel: (state, action) => {
      state.selectedLevel = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courseContent = action.payload;
      })
      .addCase(fetchCourse.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchSectionContent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSectionContent.fulfilled, (state, action) => {
        state.loading = false;
        const { chapterNumber, sectionNumber, content } = action.payload;
        state.courseContent.chapters[chapterNumber - 1].sections[sectionNumber - 1].content = content;
      })
      .addCase(fetchSectionContent.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setSelectedCategory, setSelectedCourse, setSelectedLevel } = coursesSlice.actions;
export default coursesSlice.reducer;

import mongoose, { model } from 'mongoose';
import { COURSE_LEVELS } from '../constants.js';

// Define Course Schema
const sectionSchema = new mongoose.Schema({
  section_number: Number,
  section_name: String,
  content: String,
});

const chapterSchema = new mongoose.Schema({
  chapter_number: Number,
  chapter_name: String,
  sections: [sectionSchema],
});

const CourseSchema = new mongoose.Schema({
  name: String,
  highlights: String,
  level: {
    type: String,
    enum: COURSE_LEVELS
  },
  card_image: String,
  chapters: [chapterSchema],
});


export default model('Course', CourseSchema);

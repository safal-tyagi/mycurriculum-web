import mongoose, { model } from 'mongoose';
import { COURSE_LEVELS } from '../constants.js';

const CourseSchema = new mongoose.Schema({
  name: String,
  highlights: String,
  level: {
    type: String,
    enum: COURSE_LEVELS
  },
  chapters: Array
});


export default model('Course', CourseSchema);

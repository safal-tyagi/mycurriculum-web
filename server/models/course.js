import { Schema, model } from 'mongoose';
import { COURSE_LEVELS } from '../../constants';

const CourseSchema = new Schema({
  courseId: { type: Schema.Types.ObjectId, required: true },
  courseName: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String }, // author's username only for now
  level: { type: String, required: true, enum: COURSE_LEVELS },
  categories: [{ type: String, required: true }],
  topics: [
    {
      topicName: { type: String, required: true },
      subTopics: [
        {
          subTopicName: { type: String, required: true },
          content: { type: String, required: true },
        },
      ],
    },
  ],
});

export default model('Course', CourseSchema);

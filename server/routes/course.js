import express from 'express';
import { 
    getCourses, 
    getCourse,
    createCourse, 
    updateCourse, 
    deleteCourse,
    createCourseGPT,
    addContentGPT,
    addCardImageGPT
} from '../controllers/course.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/:id', getCourse);
// router.post('/', createCourse);
// router.put('/:id', updateCourse);
// router.delete('/:id', deleteCourse);
router.post('/gpt/create-course', createCourseGPT);
router.post('/gpt/add-card-image/:courseId', addCardImageGPT);
router.post('/gpt/add-content/:courseId/:chapterNumber/:sectionNumber', addContentGPT);

export default router;
import express from 'express';
import { 
    getCourses, 
    getCourse,
    createCourse, 
    updateCourse, 
    deleteCourse,
    createCourseGPT
} from '../controllers/course.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/:id', getCourse);
router.post('/', createCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);
router.post('/gpt', createCourseGPT);

export default router;
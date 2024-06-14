import Course from "../models/course.js";

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

export const getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ msg: "Course not found" });
        }
        res.json(course);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

export const createCourse = async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.json(course);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

export const updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(course);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

export const deleteCourse = async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ msg: "Course deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};
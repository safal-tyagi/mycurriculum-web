import Course from "../models/course.js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: `${process.env.OPENAI_API_KEY}` });

const generateCoursePrompt = (name, level) => {
    return `Generate detailed and well organized course curriculum with chapter names, 
    chapter numbers and chapter sections for the following Course Name and Course Level 
    for an online course platform.

    Course Name: ${name}
    Course Level: ${level}

    Try to include at least 7 to 10 sections in each chapter and at least 10 to 12 chapters in the course. 
    Each section should have at least 2 to 3 paragraphs of content.

    Generate detailed content for the following course chapter and section. 
    Overall, the content should be long, detailed, informative, easy-to-understand, and engaging for learners. 
    Ensure that the content is accurate and relevant to the course topic.
    You can include examples, case studies, and practical applications to enhance the learning experience.
    
    Below is an example of how the course curriculum should be structured in JSON format. 
    Make sure the JSON does not contain any errors, missing information, or formatting issues like unsupported characters or symbols.


    {
        "name": "Basics of Semiconductor",
        "highlights": "Introduction to semiconductor basics, properties, and applications",
        "level": "Basic",
        "chapters": [
            {
            "chapter_number": 1,
            "chapter_name": "Introduction to Semiconductors",
            "sections": [
                    {
                        "section_number": 1.1,
                        "section_name": "What are Semiconductors?",
                        "content": "Semiconductors are materials that have electrical conductivity between that of a conductor and an insulator. They are fundamental to modern electronics and have properties that can be manipulated through doping and other processes. Semiconductors form the basis of many electronic devices, including transistors, diodes, and integrated circuits. The unique ability of semiconductors to control the flow of electrical current makes them essential in the development of various electronic components."
                    },
                    {
                        "section_number": 1.2,
                        "section_name": "History of Semiconductors",
                        "content": "The history of semiconductors dates back to the early 19th century when scientists first observed that certain materials could conduct electricity under specific conditions. The discovery of the transistor in 1947 by John Bardeen, Walter Brattain, and William Shockley at Bell Labs marked a significant milestone in semiconductor history. This breakthrough paved the way for the development of modern electronics, leading to the creation of integrated circuits and the microprocessor revolution."
                    }
                ]
            },
            {
            "chapter_number": 2,
            "chapter_name": "Types of Semiconductors",
            "sections": [
                    {
                        "section_number": 2.1,
                        "section_name": "Intrinsic Semiconductors",
                        "content": "Intrinsic semiconductors are pure forms of semiconductor materials without any significant impurities. The most common intrinsic semiconductors are silicon and germanium. In their pure state, these materials have equal numbers of electrons and holes, which are the charge carriers responsible for electrical conductivity. The intrinsic carrier concentration is dependent on the material and its temperature. For example, at room temperature, silicon has an intrinsic carrier concentration of about 1.5 x 10^10 cm^-3. Intrinsic semiconductors are used in various basic research and applications where the effects of impurities need to be minimized."
                    },
                ]
            },
        ]
    }

    
    `;

};

const generateContentPrompt = (courseName, chapterNumber, chapterName, sectionNumber, sectionName) => {
    return `Generate detailed content for the following course chapter and section. 
    Overall, the content should be long, detailed, informative, easy-to-understand, and engaging for learners. 
    Ensure that the content is accurate and relevant to the course topic.
    You can include examples, case studies, and practical applications to enhance the learning experience.
  
    Course Name: ${courseName}
    Chapter ${chapterNumber}: ${chapterName}
    Section ${sectionNumber}: ${sectionName}
    
    Here is an example of content generated based on the course name, chapter number, chapter name, and section number provided:

    instructions: 
        Course Name: Basics of Semiconductor
        Chapter 1: Introduction to Semiconductors
        Section 1.1: What are Semiconductors?

    output:
        Semiconductors are materials that have electrical conductivity between that of a conductor and an insulator. 
        They are fundamental to modern electronics and have properties that can be manipulated through doping and other processes. 
        Semiconductors form the basis of many electronic devices, including transistors, diodes, and integrated circuits. 
        The unique ability of semiconductors to control the flow of electrical current makes them essential in the development of various electronic components.
    `;
};

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

export const createCourseGPT = async (req, res) => {
    const { name, level } = req.body;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-16k',
            messages: [{
                role: 'user',
                content: generateCoursePrompt(name, level),
            }],
        });

        const courseContent = JSON.parse(response.choices[0].message.content);

        const newCourse = new Course({
            name: courseContent.name,
            highlights: courseContent.highlights || courseContent.name,
            level: courseContent.level,
            chapters: courseContent.chapters,
        });

        // to do: generate content for each section in the course for better quality

        await newCourse.save();
        res.send(newCourse);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error generating course content");
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
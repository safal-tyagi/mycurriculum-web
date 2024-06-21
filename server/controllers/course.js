import Course from "../models/course.js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: `${process.env.OPENAI_API_KEY}`});

const generateCoursePrompt = (name, level) => {
    return `Generate detailed and well organized course curriculum with chapter names, 
    chapter numbers and chapter sections for the following Course Name and Course Level 
    for an online course platform.

    Course Name: ${name}
    Course Level: ${level}
    
    Here is an example of how the course curriculum should be structured in JSON format:
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
                        "content": ""
                    },
                    {
                        "section_number": 1.2,
                        "section_name": "Properties of Semiconductors",
                        "content": ""
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
                        "content": ""
                    },
                ]
            },
        ]
    }
    `;

};

const generateContentPrompt = (courseName, chapterNumber, chapterName, sectionNumber, sectionName) => {
    return `Generate detailed content for the following course chapter and section. 
    The content should be organized in long, detailed, easy-to-understand paragraphs. 
    Include diagrams and references wherever applicable.
  
    Course Name: ${courseName}
    Chapter ${chapterNumber}: ${chapterName}
    Section ${sectionNumber}: ${sectionName}
    
    Here is an example of content generated based on the course name, chapter number, chapter name, and section number provided:

    input: 
        Course Name: Basics of Semiconductor
        Chapter 1: Introduction to Semiconductors
        Section 1.1: What are Semiconductors?

    output:
        Semiconductors are materials that have electrical conductivity between that of a conductor and an insulator. They are fundamental to modern electronics and have properties that can be manipulated through doping and other processes. Semiconductors form the basis of many electronic devices, including transistors, diodes, and integrated circuits. The unique ability of semiconductors to control the flow of electrical current makes them essential in the development of various electronic components.
    
    Overall, the content should be detailed, informative, and engaging for learners.
    
    Full Course Content Example:
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
                        "section_name": "Properties of Semiconductors",
                        "content": "Semiconductors have several key properties that distinguish them from conductors and insulators. These properties include band gap, carrier concentration, and mobility. The band gap is the energy difference between the valence and conduction bands in a semiconductor. Carrier concentration refers to the number of charge carriers in the material, which can be controlled through doping. Mobility is the ability of charge carriers to move through the material in response to an electric field. These properties are essential for understanding the behavior of semiconductors in electronic devices."
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
    }`;
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

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-16k',
        messages: [{ 
            role: 'user', 
            content: generateCoursePrompt(name, level) 
        }],
    });

    const courseContent = JSON.parse(response.choices[0].message.content);

    const newCourse = new Course({
        name: courseContent.name,
        level: courseContent.level,
        chapters: courseContent.chapters,
    });

    newCourse.chapters.forEach(chapter => {
        chapter.sections.forEach(section => {
            const response = openai.chat.completions.create({
                model: 'gpt-3.5-turbo-16k',
                messages: [{ 
                    role: 'user', 
                    content: generateContentPrompt(
                        newCourse.name, 
                        chapter.chapter_number, 
                        chapter.chapter_name, 
                        section.section_number, 
                        section.section_name
                    )
                }],
            });
        
            section.content = response.choices[0].message.content;
        });
    });

    await newCourse.save();
    res.send(newCourse);
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
import { extractJSON } from "../helpers.js";
import Course from "../models/course.js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: `${process.env.OPENAI_API_KEY}` });

const generateCardImage = (name, highlights) => {
    return `Generate a visually appealing course card image for the following course. DO NOT include any text in image. 

    Course Name: ${name}
    Course Highlights: ${highlights}
    `
};

const generateCoursePrompt = (name, level) => {
    return `Generate detailed and well organized course curriculum with chapter names, 
    chapter numbers and chapter sections for the following Course Name and Course Level 
    for an online course platform.

    Course Name: ${name}
    Course Level: ${level}

    Try to include at least 7 to 10 sections in each chapter and at least 10 to 12 chapters in the course. 
 
    Below is an example of how the course curriculum should be structured in JSON format without content: 

    {
        "name": "Basics of Semiconductor",
        "highlights": "Introduction to semiconductor basics, properties, and applications",
        "level": "Basic",
        "card_image": "",
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
                        "section_name": "History of Semiconductors",
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
    Use proper formatting, headings, and bullet points to structure the content effectively.
    Ensure that the content is accurate and relevant to the course topic.
    Include examples, code-snippets, diagrams, case studies, and practical applications to enhance the learning experience.
  
    Course Name: ${courseName}
    Chapter ${chapterNumber}: ${chapterName}
    Section ${sectionNumber}: ${sectionName}

    Do not include course name, chapter name, or section name in the content. Just provide the detailed content for the section.
    
    Below, inside the triple quotes, is the sample content generated based on: 
        Course Name: Basics of Semiconductor
        Chapter 1: Introduction to Semiconductors
        Section 1.1: What are Semiconductors?

    '''
        Semiconductors are materials with electrical conductivity that falls between that of conductors (like copper) and insulators (like glass). They are the foundational components in modern electronic devices due to their unique properties. Here are the key characteristics and applications of semiconductors:

        ### Key Characteristics:
        1. **Conductivity**: Semiconductors have moderate electrical conductivity, which can be manipulated by adding impurities, a process known as doping.
        2. **Band Gap**: They have a band gap between the valence band and conduction band. This gap allows them to control the flow of electrical current.
        3. **Doping**: By introducing impurities into the semiconductor material, its electrical properties can be altered. Doping can create either an excess of electrons (n-type) or an excess of holes (p-type).
        4. **Temperature Sensitivity**: The conductivity of semiconductors increases with temperature, which is the opposite of conductors.

        ### Common Semiconductor Materials:
        - **Silicon (Si)**: The most widely used semiconductor material, especially in integrated circuits and microchips.
        - **Germanium (Ge)**: Used in some high-speed devices, though less common than silicon.
        - **Gallium Arsenide (GaAs)**: Used in specialized applications like microwave and high-frequency circuits.

        ### Applications:
        1. **Transistors**: Semiconductors are used to make transistors, which are the building blocks of electronic devices, allowing for amplification and switching of electronic signals.
        2. **Diodes**: Semiconductors are used in diodes, which allow current to flow in one direction and block it in the opposite direction.
        3. **Integrated Circuits (ICs)**: Semiconductors form the basis of ICs, which are essential components in computers, smartphones, and many other electronic devices.
        4. **Solar Cells**: Semiconductors like silicon are used in photovoltaic cells to convert sunlight into electricity.
        5. **LEDs and Lasers**: Semiconductor materials are used in light-emitting diodes (LEDs) and laser diodes for a variety of lighting and display applications.

        Semiconductors have revolutionized technology and are crucial in the development of modern electronic and computing systems.
    '''
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

export const createCourseGPT = async (req, res) => {
    const { name, level } = req.body;

    // check if course already exists
    const existingCourse = await Course.findOne({ name, level });
    if (existingCourse) {
        return res.status(400).send('Course already exists');
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{
                role: 'user',
                content: generateCoursePrompt(name, level),
            }],
        });

        const courseContent = extractJSON(response.choices[0].message.content);

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

export const addCardImageGPT = async (req, res) => {
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).send('Course not found');
        }

        const { name, highlights } = course;
        const response = await openai.images.generate({
            prompt: generateCardImage(name, highlights),
            model: 'dall-e-3',
            quality: 'standard',
            size: '1024x1024',
            response_format: 'b64_json',
            style: 'natural',
        });

        const courseCardImage = response.data[0].b64_json;
        course.card_image = courseCardImage;

        await course.save();
        res.send(course);
    } catch (error) {
        console.error("Error generating course card image: ", error.message);
        res.status(500).send({ error: 'Error generating course card image' });
    }
}

export const addContentGPT = async (req, res) => {
    const { courseId, chapterNumber, sectionNumber } = req.params;
  
    try {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).send('Course not found');
      }
  
      const chapter = course.chapters.find(c => c.chapter_number == chapterNumber);
      if (!chapter) {
        return res.status(404).send('Chapter not found');
      }
  
      const section = chapter.sections.find(s => s.section_number == sectionNumber);
      if (!section) {
        return res.status(404).send('Section not found');
      }

      const trimmedCourse = { 
        name: course.name, 
        highlights: course.highlights,
        level: course.level,
        card_image: '', // To reduce response size, do not include card image
        chapters: course.chapters.map(chapter => {
            return {
                chapter_number: chapter.chapter_number,
                chapter_name: chapter.chapter_name,
                sections: chapter.sections.map(section => {
                return {
                    section_number: section.section_number,
                    section_name: section.section_name,
                    content: '', // To reduce response size, do not include content
                };
                }),
            };
        }),
    };

    // Maintain conversation history including previous responses
    const conversationHistory = [
        { role: 'user', content: generateCoursePrompt(course.name, course.level) },
        { role: 'assistant', content: JSON.stringify(trimmedCourse) }, // Previous assistant response
        { role: 'user', content: generateContentPrompt(course.name, chapterNumber, chapter.chapter_name, sectionNumber, section.section_name)}
      ];
  
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: conversationHistory,
      });
  
      const content = response.choices[0].message.content;
      section.content = content;
  
      await course.save();
      res.send(course);
    } catch (error) {
      console.error("Error generating content for the section: ", error.message);
      res.status(500).send({ error: 'Error generating content for the section' });
    }
  };

// export const createCourse = async (req, res) => {
//     try {
//         const course = new Course(req.body);
//         await course.save();
//         res.json(course);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Server Error");
//     }
// };

// export const updateCourse = async (req, res) => {
//     try {
//         const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.json(course);
//     }
//     catch (err) {
//         console.error(err);
//         res.status(500).send("Server Error");
//     }
// };

// export const deleteCourse = async (req, res) => {
//     try {
//         await Course.findByIdAndDelete(req.params.id);
//         res.json({ msg: "Course deleted" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Server Error");
//     }
// };
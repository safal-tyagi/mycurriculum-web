import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, IconButton, Container, CircularProgress } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useGetCourseQuery, useAddContentGPTMutation } from './coursesApi';
import ReactMarkdown from 'react-markdown';
import '../../index.css';

const CourseReader = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: courseContent, isLoading: isCourseLoading } = useGetCourseQuery(courseId);
  const [addContentGPT, { isLoading: isAddingContent }] = useAddContentGPTMutation();
  const [selectedSectionContent, setSelectedSectionContent] = useState('');

  useEffect(() => {
    if (courseContent && courseContent.chapters.length > 0) {
      const firstChapter = courseContent.chapters[0];
      const firstSection = firstChapter.sections[0];
      setSelectedSectionContent(firstSection.content || '');
    }
  }, [courseContent]);

  const handleSectionClick = async (chapterNumber, sectionNumber) => {
    const result = await addContentGPT({ courseId, chapterNumber, sectionNumber });
    if (result.data) {
      setSelectedSectionContent(result.data.content);
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  return (
    <Container>
      <IconButton onClick={handleBackClick}>
        <ArrowBackIcon />
      </IconButton>
      <IconButton onClick={() => toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={drawerOpen} onClose={() => toggleDrawer(false)}>
        <List>
          {courseContent && courseContent.chapters.map((chapter) => (
            <React.Fragment key={chapter.chapter_number}>
              <ListItem>
                <ListItemText primary={chapter.chapter_name} />
              </ListItem>
              {chapter.sections.map((section) => (
                <ListItem
                  button
                  key={section.section_number}
                  onClick={() => handleSectionClick(chapter.chapter_number, section.section_number)}
                >
                  <ListItemText secondary={section.section_name} />
                </ListItem>
              ))}
            </React.Fragment>
          ))}
        </List>
      </Drawer>
      {(isCourseLoading || isAddingContent) && <CircularProgress />}
      <div className="markdown-body">
        <ReactMarkdown>{selectedSectionContent}</ReactMarkdown>
      </div>
    </Container>
  );
};

export default CourseReader;

import React, { useEffect, useState, Fragment } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Container,
  CircularProgress,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Grid,
  Breadcrumbs,
  Link,
  Collapse,
  Button,
} from "@mui/material";
import {
  Menu,
  Home,
  Class,
  ExpandLess,
  ExpandMore,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";
import { useGetCourseQuery, useAddContentGPTMutation } from "./coursesApi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/a11y-dark.css";
import "../../index.css";

const CourseReader = () => {
  const { courseId, chapterNumber, sectionNumber } = useParams();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const { data: courseContent, isLoading: isCourseLoading } =
    useGetCourseQuery(courseId);
  const [addContentGPT, { isLoading: isAddingContent }] =
    useAddContentGPTMutation();
  const [selectedSectionContent, setSelectedSectionContent] = useState("");

  useEffect(() => {
    if (courseContent && courseContent.chapters.length > 0) {
      setCurrentCourse(courseContent);

      if (chapterNumber) {
        const chapter = courseContent.chapters.find(
          (ch) => ch.chapter_number === parseInt(chapterNumber)
        );
        setCurrentChapter(chapter);

        if (sectionNumber) {
          const section = chapter.sections.find(
            (sec) => sec.section_number === parseFloat(sectionNumber)
          );
          setCurrentSection(section);
          if (section.content) {
            setSelectedSectionContent(section.content);
          } else {
            handleSectionClick(chapter.chapter_number, section.section_number);
          }
        } else {
          setCurrentSection(null);
          setSelectedSectionContent("");
        }
      } else {
        setCurrentChapter(null);
        setCurrentSection(null);
        setSelectedSectionContent("");
      }
    }
  }, [courseContent, chapterNumber, sectionNumber]);

  const handleChapterClick = (chapterNumber) => {
    const chapter = currentCourse.chapters.find(
      (ch) => ch.chapter_number === chapterNumber
    );
    setCurrentChapter(chapter);
    setCurrentSection(null);
    setSelectedSectionContent("");
    navigate(`/course/${courseId}/${chapterNumber}`);
  };

  const handleSectionClick = async (chapterNumber, sectionNumber) => {
    const chapter = currentCourse.chapters.find(
      (ch) => ch.chapter_number === chapterNumber
    );
    const section = chapter.sections.find(
      (sec) => sec.section_number === sectionNumber
    );

    setCurrentSection(section);
    setSelectedSectionContent("");

    navigate(`/course/${courseId}/${chapterNumber}/${sectionNumber}`);

    if (section.content) {
      setSelectedSectionContent(section.content);
    } else {
      const result = await addContentGPT({
        courseId,
        chapterNumber,
        sectionNumber,
      });
      if (result.data) {
        const updatedSections = chapter.sections.map((sec) =>
          sec.section_number === sectionNumber
            ? { ...sec, content: result.data.content }
            : sec
        );
        const updatedChapters = currentCourse.chapters.map((ch) =>
          ch.chapter_number === chapterNumber
            ? { ...ch, sections: updatedSections }
            : ch
        );
        const updatedCourse = { ...currentCourse, chapters: updatedChapters };

        setCurrentCourse(updatedCourse);
        setSelectedSectionContent(result.data.content);
      }
    }
    window.scrollTo(0, 0);
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleCourseClick = () => {
    setCurrentChapter(null);
    setCurrentSection(null);
    setSelectedSectionContent("");
    navigate(`/course/${courseId}`);
  };

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  const navigateToPreviousSection = () => {
    if (!currentSection || !currentChapter) return;
    const currentChapterIndex = currentCourse.chapters.findIndex(
      (ch) => ch.chapter_number === currentChapter.chapter_number
    );
    const currentSectionIndex = currentChapter.sections.findIndex(
      (sec) => sec.section_number === currentSection.section_number
    );

    if (currentSectionIndex > 0) {
      handleSectionClick(
        currentChapter.chapter_number,
        currentChapter.sections[currentSectionIndex - 1].section_number
      );
    } else if (currentChapterIndex > 0) {
      const previousChapter = currentCourse.chapters[currentChapterIndex - 1];
      handleSectionClick(
        previousChapter.chapter_number,
        previousChapter.sections[previousChapter.sections.length - 1]
          .section_number
      );
    }
    window.scrollTo(0, 0);
  };

  const navigateToNextSection = () => {
    if (!currentSection || !currentChapter) return;
    const currentChapterIndex = currentCourse.chapters.findIndex(
      (ch) => ch.chapter_number === currentChapter.chapter_number
    );
    const currentSectionIndex = currentChapter.sections.findIndex(
      (sec) => sec.section_number === currentSection.section_number
    );

    if (currentSectionIndex < currentChapter.sections.length - 1) {
      handleSectionClick(
        currentChapter.chapter_number,
        currentChapter.sections[currentSectionIndex + 1].section_number
      );
    } else if (currentChapterIndex < currentCourse.chapters.length - 1) {
      const nextChapter = currentCourse.chapters[currentChapterIndex + 1];
      handleSectionClick(
        nextChapter.chapter_number,
        nextChapter.sections[0].section_number
      );
    }
    window.scrollTo(0, 0);
  };

  const isFirstSection =
    currentChapter &&
    currentSection &&
    currentCourse.chapters[0].chapter_number ===
      currentChapter.chapter_number &&
    currentChapter.sections[0].section_number === currentSection.section_number;
  const isLastSection =
    currentChapter &&
    currentSection &&
    currentCourse.chapters[currentCourse.chapters.length - 1].chapter_number ===
      currentChapter.chapter_number &&
    currentChapter.sections[currentChapter.sections.length - 1]
      .section_number === currentSection.section_number;

  return (
    <Box>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => toggleDrawer(true)}
          >
            <Menu />
          </IconButton>
          <Class sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Curriculum
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        classes={{ paper: "drawer" }}
      >
        <List>
          {currentCourse &&
            currentCourse.chapters.map((chapter) => (
              <Fragment key={chapter.chapter_number}>
                <ListItem
                  button
                  onClick={() => handleChapterClick(chapter.chapter_number)}
                >
                  <ListItemText
                    primary={`${chapter.chapter_number}. ${chapter.chapter_name}`}
                    classes={{ primary: "list-item-text" }}
                  />
                  {currentChapter &&
                  currentChapter.chapter_number === chapter.chapter_number ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </ListItem>
                <Collapse
                  in={
                    currentChapter &&
                    currentChapter.chapter_number === chapter.chapter_number
                  }
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {chapter.sections.map((section) => (
                      <ListItem
                        button
                        key={section.section_number}
                        onClick={() =>
                          handleSectionClick(
                            chapter.chapter_number,
                            section.section_number
                          )
                        }
                      >
                        <ListItemText
                          primary={`${section.section_number}. ${section.section_name}`}
                          classes={{ primary: "list-item-text" }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Fragment>
            ))}
        </List>
      </Drawer>
      <Container>
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginY: 2 }}>
          <Link
            color="inherit"
            onClick={handleHomeClick}
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <Home sx={{ mr: 0.5 }} />
            Home
          </Link>
          {currentCourse && (
            <Link
              color="inherit"
              onClick={handleCourseClick}
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            >
              {currentCourse.name}
            </Link>
          )}
          {currentChapter && (
            <Link
              color="inherit"
              onClick={() => {
                setCurrentSection(null);
                setSelectedSectionContent("");
              }}
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            >
              {currentChapter.chapter_name}
            </Link>
          )}
          {currentSection && (
            <Typography
              color="textPrimary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              {currentSection.section_name}
            </Typography>
          )}
        </Breadcrumbs>
        {(isCourseLoading || isAddingContent) && <CircularProgress />}
        {currentCourse && !currentChapter && !currentSection && (
          <Box>
            <Typography variant="h5">Chapters</Typography>
            <List>
              {currentCourse.chapters.map((chapter) => (
                <ListItem
                  button
                  key={chapter.chapter_number}
                  onClick={() => handleChapterClick(chapter.chapter_number)}
                >
                  <ListItemText
                    primary={`${chapter.chapter_number}. ${chapter.chapter_name}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        {currentChapter && !currentSection && (
          <Box>
            <Typography variant="h5">Sections</Typography>
            <List>
              {currentChapter.sections.map((section) => (
                <ListItem
                  button
                  key={section.section_number}
                  onClick={() =>
                    handleSectionClick(
                      currentChapter.chapter_number,
                      section.section_number
                    )
                  }
                >
                  <ListItemText
                    primary={`${section.section_number}. ${section.section_name}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        {currentSection && (
          <Grid container spacing={2} justifyContent="center">
            <div className="markdown-body">
              <ReactMarkdown
                children={selectedSectionContent}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              />
            </div>
            <Grid container justifyContent="space-between" sx={{ marginY: 2 }}>
              <Button
                variant="contained"
                onClick={navigateToPreviousSection}
                disabled={isFirstSection}
                startIcon={<ArrowBack />}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                onClick={navigateToNextSection}
                disabled={isLastSection}
                endIcon={<ArrowForward />}
              >
                Next
              </Button>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default CourseReader;

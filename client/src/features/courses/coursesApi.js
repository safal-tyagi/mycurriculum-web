import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const SERVER_URL = "https://mycurriculum.io";
export const coursesApi = createApi({
  reducerPath: "coursesApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${SERVER_URL}/api/courses` }),
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: () => "/",
    }),
    getCourse: builder.query({
      query: (id) => `/${id}`,
    }),
    createCourse: builder.mutation({
      query: (newCourse) => ({
        url: "/",
        method: "POST",
        body: newCourse,
      }),
    }),
    updateCourse: builder.mutation({
      query: ({ id, ...updatedCourse }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updatedCourse,
      }),
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
    createCourseGPT: builder.mutation({
      query: (courseData) => ({
        url: "/gpt/create-course",
        method: "POST",
        body: courseData,
      }),
    }),
    addContentGPT: builder.mutation({
      query: ({ courseId, chapterNumber, sectionNumber }) => ({
        url: `/gpt/add-content/${courseId}/${chapterNumber}/${sectionNumber}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useCreateCourseGPTMutation,
  useAddContentGPTMutation,
} = coursesApi;

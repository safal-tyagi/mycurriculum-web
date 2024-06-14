import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const coursesApi = createApi({
  reducerPath: 'coursesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api' }),
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: () => 'courses'
    }),
    getCourse: builder.query({
      query: (id) => `courses/${id}`
    })
  })
});

export const { useGetCoursesQuery, useGetCourseQuery } = coursesApi;
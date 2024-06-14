// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import { coursesApi } from '../features/courses/coursesSlice';

export const store = configureStore({
  reducer: {
    [coursesApi.reducerPath]: coursesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(coursesApi.middleware),
});

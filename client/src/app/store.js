import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "../features/courses/coursesSlice";
import { coursesApi } from "../features/courses/coursesApi";

const store = configureStore({
  reducer: {
    courses: coursesReducer,
    [coursesApi.reducerPath]: coursesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(coursesApi.middleware),
});

export default store;

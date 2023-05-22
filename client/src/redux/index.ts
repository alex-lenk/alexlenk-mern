import {configureStore} from "@reduxjs/toolkit";
import postsReducer from "./slices/posts";
import postReducer from "./slices/post";
import userReducer from "./slices/auth";

const reducer = {
  posts: postsReducer,
  post: postReducer,
  auth: userReducer,
};

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;

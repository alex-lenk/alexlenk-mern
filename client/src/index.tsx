import React from "react";
import {createRoot} from 'react-dom/client';
import {Provider} from "react-redux";
import App from "./App";
import {configureStore} from "@reduxjs/toolkit";
import postsReducer from "./redux/slices/posts";
import postReducer from "./redux/slices/post";
import userReducer from "./redux/slices/auth";

const reducer = {
    posts: postsReducer,
    post: postReducer,
    auth: userReducer,
};

export const store = configureStore({
    reducer,
});
export type RootState = ReturnType<typeof store.getState>;

const container = document.getElementById('root');
if (!container) {
    throw new Error(
        'Контейнер root не найден. НЕ удалось вмонтировать реакт приложение',
    );
}

createRoot(container).render(
    <Provider store={store}>
        <App/>
    </Provider>,
);

import { configureStore } from '@reduxjs/toolkit';
import classesReducer from './slices/classes/classes.slice';
import editorReducer from './slices/editor/editor.slice';
// ----------------------------------------------------------------------

const store = configureStore({
  reducer: {
    classes: classesReducer,
    editor: editorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export { store };

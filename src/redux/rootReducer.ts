import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
// slices
import { editorReducer } from './slices/editor';

const isClient = typeof window !== 'undefined';

const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};

// avoiding localStorage setup for Next.js server
const storage = isClient ? createWebStorage('local') : createNoopStorage();

const rootPersistConfig = {
  key: 'root',
  keyPrefix: 'redux-',
  storage,
  whitelist: [],
};

const editorPersistConfig = {
  key: 'editor',
  storage,
  keyPrefix: 'redux-',
};

const rootReducer = combineReducers({
  // editor: editorReducer,
  // !comment the next line for debugging purposes
  editor: persistReducer(editorPersistConfig, editorReducer),
});

export { rootPersistConfig, rootReducer };

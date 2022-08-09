import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
// slices
import { editorReducer } from './slices/editor';
import { layersReducer } from './slices/layers';

const isClient = typeof window !== 'undefined';

const createNoopStorage = () => ({
  getItem(_key: any) {
    return Promise.resolve(null);
  },
  setItem(_key: any, value: any) {
    return Promise.resolve(value);
  },
  removeItem(_key: any) {
    return Promise.resolve();
  },
});

// avoiding localStorage setup for Next.js server
const storage = isClient ? createWebStorage('local') : createNoopStorage();

const rootPersistConfig = {
  key: 'root',
  keyPrefix: 'redux-',
  storage,
  // whitelist: ['redux-editor', 'editor'],
};

const editorPersistConfig = {
  key: 'editor',
  storage,
  keyPrefix: 'redux-',
};

const rootReducer = combineReducers({
  editor: editorReducer,
  layers: layersReducer,
  // !comment the next line for debugging purposes
  // editor: persistReducer(editorPersistConfig, editorReducer),
});

export { rootPersistConfig, rootReducer };

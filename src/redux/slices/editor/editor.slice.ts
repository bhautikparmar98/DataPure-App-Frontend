import { createSlice } from '@reduxjs/toolkit';

import { Tool, TOOLS } from 'src/constants';
import { EditorActionTypes } from './editor.types';

type State = {
  tool: Tool;
  isDrawing: boolean;
  preview: string;
};

const initialState: State = {
  tool: TOOLS.RECTANGLE as Tool,
  isDrawing: true,
  preview: '',
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setTool: (state, action) => {
      state.tool = action.payload.tool;
    },

    startDrawing: (state, action) => {
      state.isDrawing = true;
    },
    endDrawing: (state, action) => {
      state.isDrawing = false;
    },

    setPreview: (state, action) => {
      const { src } = action.payload;
      state.preview = src;
    },
  },
});

export const { setTool, startDrawing, endDrawing, setPreview } =
  editorSlice.actions;
export default editorSlice.reducer;

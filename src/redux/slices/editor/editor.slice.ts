import { createSlice } from '@reduxjs/toolkit';

import { Tool, TOOLS } from 'src/constants';

type State = {
  tool: Tool;
  stageDragging: boolean;
  preview: string;
};

const initialState: State = {
  tool: TOOLS.RECTANGLE as Tool,
  stageDragging: false,
  preview: '',
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setTool: (state, action) => {
      state.tool = action.payload.tool;
    },

    startDragging: (state, action) => {
      state.stageDragging = action.payload.stageDragging || false;
    },

    setPreview: (state, action) => {
      const { src } = action.payload;
      state.preview = src;
    },
  },
});

export const { setTool, startDragging, setPreview } = editorSlice.actions;
export default editorSlice.reducer;

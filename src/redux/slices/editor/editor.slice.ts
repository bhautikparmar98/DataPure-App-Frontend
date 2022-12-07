import { createSlice } from '@reduxjs/toolkit';

import { Tool, TOOLS } from 'src/constants';

type State = {
  tool: Tool;
  stageDragging: boolean;
  preview: string;
  multiSelectmode: boolean;
};

const initialState: State = {
  tool: TOOLS.RECTANGLE as Tool,
  stageDragging: false,
  preview: '',
  multiSelectmode: false
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setTool: (state, action) => {
      state.tool = action.payload.tool;
      if(action.payload.tool === TOOLS.MULTIPLESELECT){
        state.multiSelectmode = true
      }else{
        state.multiSelectmode = false
      }
    },

    startDragging: (state, { payload }) => {
      if (state.stageDragging !== payload.stageDragging)
        state.stageDragging = payload.stageDragging;
    },

    setPreview: (state, action) => {
      const { src } = action.payload;
      state.preview = src;
    },
  },
});

export const { setTool, startDragging, setPreview } = editorSlice.actions;
export default editorSlice.reducer;

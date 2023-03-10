import { createSlice } from '@reduxjs/toolkit';

import { Tool, TOOLS } from 'src/constants';

type State = {
  tool: Tool;
  stageDragging: boolean;
  preview: string;
  multiSelectmode: boolean;
  projectImagesIds: {
    [projectId: string]: string[];
  };
  projectName: string;
};

const initialState: State = {
  tool: TOOLS.RECTANGLE as Tool,
  stageDragging: false,
  preview: '',
  multiSelectmode: false,
  projectImagesIds: {},
  projectName: ''
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    resetEditor: (state) => {
      state = initialState;
      return state;
    },
    setTool: (state, action) => {
      state.tool = action.payload.tool;
      if(action.payload.tool === TOOLS.MULTIPLESELECT){
        state.multiSelectmode = true
      }else{
        state.multiSelectmode = false
      }
    },

    startDragging: (state, { payload }) => {
      if (state.stageDragging !== payload.stageDragging) state.stageDragging = payload.stageDragging;
    },

    setPreview: (state, action) => {
      const { src } = action.payload;
      state.preview = src;
    },

    addProjectIds: (state, { payload }) => {
      const { projectId, imagesIds } = payload;
      if (typeof projectId === 'string' && imagesIds?.length >= 0) state.projectImagesIds[projectId] = imagesIds;
    },
  },
});

export const { resetEditor, setTool, startDragging, setPreview, addProjectIds } = editorSlice.actions;
export default editorSlice.reducer;

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

export const editorReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case EditorActionTypes.SET_TOOL:
      return {
        ...state,
        tool: action.payload.tool,
      };

    case EditorActionTypes.START_DRAWING:
    case EditorActionTypes.End_DRAWING:
      return {
        ...state,
        isDrawing: action.type === EditorActionTypes.START_DRAWING,
      };

    case EditorActionTypes.SET_PREVIEW: {
      const { src } = action.payload;
      state.preview = src;
      return {
        ...state,
        preview: src,
      };
    }

    default:
      return state;
  }
};

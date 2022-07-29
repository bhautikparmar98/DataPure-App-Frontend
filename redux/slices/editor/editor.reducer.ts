import { EditorActionTypes, IEditor } from './editor.types';
import { TOOLS } from '@constants';

const initialState = {
  tool: TOOLS.PEN,
};

export const editorReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case EditorActionTypes.SET_TOOL:
      return {
        ...state,
        tool: action.payload.tool,
      };

    default:
      return state;
  }
};

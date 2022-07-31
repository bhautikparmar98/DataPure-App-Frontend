import { EditorActionTypes } from './editor.types';

import { Tool } from 'src/constants';
import { dispatch } from 'src/redux/store';

export function setTool(tool: Tool) {
  return () =>
    dispatch({
      type: EditorActionTypes.SET_TOOL,
      payload: { tool },
    });
}

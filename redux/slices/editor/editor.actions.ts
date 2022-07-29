import { EditorActionTypes } from './editor.types';
import { dispatch } from 'redux/store';
import { Tool } from '@constants';

export function setTool(tool: Tool) {
  return () =>
    dispatch({
      type: EditorActionTypes.SET_TOOL,
      payload: { tool },
    });
}

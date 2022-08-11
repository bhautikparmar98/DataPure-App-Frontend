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

export function startDrawing() {
  return () =>
    dispatch({
      type: EditorActionTypes.START_DRAWING,
    });
}
export function endDrawing() {
  return () =>
    dispatch({
      type: EditorActionTypes.End_DRAWING,
    });
}

export function setPreview({ src }: { src: string }) {
  return () =>
    dispatch({
      type: EditorActionTypes.SET_PREVIEW,
      payload: { src },
    });
}

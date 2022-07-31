import { EditorActionTypes } from './editor.types';

import { Instance, Tool } from 'src/constants';
import { dispatch } from 'src/redux/store';

export function setTool(tool: Tool) {
  return () =>
    dispatch({
      type: EditorActionTypes.SET_TOOL,
      payload: { tool },
    });
}

export function selectMask(maskId: number) {
  return () =>
    dispatch({
      type: EditorActionTypes.SELECT_MASK,
      payload: { maskId },
    });
}

export function deleteInstance(maskId: number, instanceId: string) {
  return () =>
    dispatch({
      type: EditorActionTypes.DELETE_INSTANCE,
      payload: { maskId, instanceId },
    });
}

export function addInstance(maskId: number, instance: Instance) {
  return () =>
    dispatch({
      type: EditorActionTypes.ADD_INSTANCE,
      payload: { maskId, instance },
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

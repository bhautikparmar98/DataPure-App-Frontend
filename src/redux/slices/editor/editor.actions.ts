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

export function selectLayer(layerId: number) {
  return () =>
    dispatch({
      type: EditorActionTypes.SELECT_LAYER,
      payload: { layerId },
    });
}

export function deleteInstance(layerId: number, instanceId: string) {
  return () =>
    dispatch({
      type: EditorActionTypes.DELETE_INSTANCE,
      payload: { layerId, instanceId },
    });
}

export function addInstance(layerId: number, instance: Instance) {
  return () =>
    dispatch({
      type: EditorActionTypes.ADD_INSTANCE,
      payload: { layerId, instance },
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

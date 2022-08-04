import { EditorActionTypes } from './editor.types';

import { Instance, Tool } from 'src/constants';
import { dispatch } from 'src/redux/store';
import Konva from 'konva';

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

export function addShape(
  layerId: number,
  instanceId: number,
  shape: Konva.ShapeConfig
) {
  return () =>
    dispatch({
      type: EditorActionTypes.ADD_SHAPE,
      payload: { layerId, instanceId, shape },
    });
}

export function updateShape(
  selectedLayerId: number,
  newAttrs: Konva.ShapeConfig
) {
  return () =>
    dispatch({
      type: EditorActionTypes.UPDATE_SHAPE,
      payload: { selectedLayerId, newAttrs },
    });
}

export function addEraserLines(
  layerId: number,
  rectId: string,
  lines: Konva.ShapeConfig[]
) {
  return () => {
    dispatch({
      type: EditorActionTypes.ADD_ERASER_LINES,
      payload: { layerId, rectId, lines },
    });
  };
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

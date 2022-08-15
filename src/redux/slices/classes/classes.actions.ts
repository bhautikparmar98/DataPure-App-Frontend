import { EditorActionTypes } from './classes.types';

import { Annotation } from 'src/constants';
import { dispatch } from 'src/redux/store';
import Konva from 'konva';

export function initializeState(state: any) {
  return () =>
    dispatch({
      type: EditorActionTypes.INITIALIZE_STATE,
      payload: { state },
    });
}

export function selectClass(classId: number) {
  return () =>
    dispatch({
      type: EditorActionTypes.SELECT_CLASS,
      payload: { classId },
    });
}

export function deleteAnnotation(classId: number, annotationId: string) {
  return () =>
    dispatch({
      type: EditorActionTypes.DELETE_ANNOTATION,
      payload: { classId, annotationId },
    });
}

export function addAnnotation(classId: number, annotation: Annotation) {
  return () =>
    dispatch({
      type: EditorActionTypes.ADD_ANNOTATION,
      payload: { classId, annotation },
    });
}

export function updateAnnotation(
  classId: number,
  annotationId: string,
  update: Konva.ShapeConfig
) {
  return () =>
    dispatch({
      type: EditorActionTypes.UPDATE_ANNOTATION,
      payload: { classId, annotationId, update },
    });
}

export function addShape(
  classId: number,
  annotationId: number,
  shape: Konva.ShapeConfig
) {
  return () =>
    dispatch({
      type: EditorActionTypes.ADD_SHAPE,
      payload: { classId, annotationId, shape },
    });
}

export function updateShape(
  selectedClassId: number,
  newAttrs: Konva.ShapeConfig
) {
  return () =>
    dispatch({
      type: EditorActionTypes.UPDATE_SHAPE,
      payload: { selectedClassId, newAttrs },
    });
}

export function addEraserLines(
  classId: number,
  rectId: string,
  lines: Konva.ShapeConfig[]
) {
  return () => {
    dispatch({
      type: EditorActionTypes.ADD_ERASER_LINES,
      payload: { classId, rectId, lines },
    });
  };
}

export function setComments(
  comments: { text: string; x: number; y: number }[]
) {
  return () => {
    dispatch({
      type: EditorActionTypes.SET_COMMENTS,
      payload: { comments },
    });
  };
}

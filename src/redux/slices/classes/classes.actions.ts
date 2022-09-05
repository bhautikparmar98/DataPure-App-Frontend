import { EditorActionTypes } from './classes.types';

import { Annotation, Tool } from 'src/constants';
import { dispatch } from 'src/redux/store';
import Konva from 'konva';

export function initializeState(state: any) {
  return () =>
    dispatch({
      type: EditorActionTypes.INITIALIZE_STATE,
      payload: { state },
    });
}

export function resetState() {
  return () =>
    dispatch({
      type: EditorActionTypes.RESET_STATE,
      payload: {},
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

export function addAnnotation(
  classIndex: number,
  classId: string,
  annotation: Annotation
) {
  return () =>
    dispatch({
      type: EditorActionTypes.ADD_ANNOTATION,
      payload: { classIndex, classId, annotation },
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

export function toggleAnnotationsVisibility(
  classId: number,
  annotationIds: string[],
  visible: boolean
) {
  return () =>
    dispatch({
      type: EditorActionTypes.TOGGLE_ANNOTATION_VISIBILITY,
      payload: { classId, annotationIds, visible },
    });
}

export function deleteAnnotations(classId: number, annotationIds: string[]) {
  return () =>
    dispatch({
      type: EditorActionTypes.DELETE_ANNOTATIONS,
      payload: { classId, annotationIds },
    });
}

export function changeAnnotationsClass(
  oldClassIndex: number,
  newClassIndex: number,
  annotationIds: string[]
) {
  return () =>
    dispatch({
      type: EditorActionTypes.CHANGE_ANNOTATIONS_CLASS,
      payload: { oldClassIndex, newClassIndex, annotationIds },
    });
}
export function moveAnnotation(
  classId: number,
  annotationId: string,
  update: { x: number; y: number; points: number[]; type: Tool }
) {
  return () =>
    dispatch({
      type: EditorActionTypes.MOVE_ANNOTATION,
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
  selectedClassIndex: number,
  newAttrs: Konva.ShapeConfig
) {
  return () =>
    dispatch({
      type: EditorActionTypes.UPDATE_SHAPE,
      payload: { selectedClassIndex, newAttrs },
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

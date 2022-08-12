import { EditorActionTypes } from './classes.types';
import { classes, Class, Annotation } from 'src/constants';
import Konva from 'konva';

type State = {
  classes: Class[];
  selectedClassId: number;
  currentAnnotationId: number | null;
  comments: { text: string; x: number; y: number }[];
};

const initialState: State = {
  classes,
  selectedClassId: 0,
  currentAnnotationId: 0, //!Unset this value later
  comments: [],
};

export const classesReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case EditorActionTypes.SELECT_CLASS:
      return {
        ...state,
        selectedClassId: action.payload.classId,
      };

    case EditorActionTypes.DELETE_ANNOTATION: {
      const { classId, annotationId } = action.payload;
      const { classes } = state;
      let annotations = classes[classId]?.annotations;
      annotations = annotations.filter(
        (annotation: Annotation) => annotation.id !== annotationId
      );
      const newClasses = [] as Class[];

      classes.forEach((item, i) => {
        if (i === classId) item.annotations = annotations;
        newClasses.push(item);
      });
      return {
        ...state,
        classes: newClasses,
      };
    }

    case EditorActionTypes.ADD_ANNOTATION: {
      const { classes } = state;
      const { classId, annotation } = action.payload;
      classes[classId].annotations.push(annotation);
      return {
        ...state,
        classes,
      };
    }

    case EditorActionTypes.UPDATE_ANNOTATION: {
      const { classes } = state;
      const { classId, annotationId, update } = action.payload;
      const annotations = classes[classId]?.annotations;
      if (!annotations || annotations.length === 0) return state;
      for (let i = 0; i < annotations.length; i++) {
        if (annotations[i].id === annotationId) {
          classes[classId].annotations[i] = {
            ...annotations[i],
            ...update,
          };
        }
      }
      return {
        ...state,
        classes,
      };
    }

    // case EditorActionTypes.ADD_SHAPE: {
    //   const { classId, shape } = action.payload;
    //   shape.id = uniqid();
    //   state.classes[classId]?.annotations.push({
    //     visible: true,
    //     id: uniqid(),
    //     shapes: [[shape]],
    //   });
    //   return state;
    // }

    case EditorActionTypes.UPDATE_SHAPE: {
      const { classes } = state;
      const {
        newAttrs,
        selectedClassId,
      }: { newAttrs: Konva.ShapeConfig; selectedClassId: number } =
        action.payload;
      const shapeId = newAttrs?.id;
      const annotations: Annotation[] = classes[selectedClassId]?.annotations;
      if (annotations && typeof shapeId === 'string') {
        annotations.forEach((annotation: Annotation, i) => {
          annotation.shapes.forEach((shape, g) => {
            if (shape.id === shapeId) {
              classes[selectedClassId].annotations[i].shapes[g] = {
                ...shape,
                ...newAttrs,
              };
            }
          });
        });
      }
      return {
        ...state,
        classes,
      };
    }

    case EditorActionTypes.SET_COMMENTS:
      const { comments } = action.payload;
      if (comments?.length >= 0) state.comments = comments;
      return state;

    default:
      return state;
  }
};

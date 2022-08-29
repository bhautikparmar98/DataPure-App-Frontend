import Konva from 'konva';
import _ from 'lodash';
import { Annotation, Class, TOOLS } from 'src/constants';
import uniqid from 'uniqid';
import { EditorActionTypes } from './classes.types';

type State = {
  classes: Class[];
  selectedClassIndex: number;
  currentAnnotationId: number | null;
  comments: { text: string; x: number; y: number }[];
  src: string;
  imageId: string;
};

const initialState: State = {
  classes: [],
  selectedClassIndex: 0,
  currentAnnotationId: 0,
  comments: [],
  src: '',
  imageId: '',
};

export const classesReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case EditorActionTypes.INITIALIZE_STATE:
      if (action.payload.state?.images.length === 0) return state;

      const { src, project, annotations, _id } =
        action.payload.state?.images[0];

      const purifiedAnnos = annotations?.map((anno: any) => {
        const { id, classId, shapes, visible } = anno;
        const purifiedShapes = shapes.map((shape: any) => {
          delete shape._id;
          return shape;
        });
        anno = {
          id: id || uniqid(),
          classId,
          shapes: purifiedShapes,
          visible,
        };

        return anno;
      });

      let { classes } = project;
      classes = classes.map((classItem: Class) => ({
        ...classItem,
        annotations: purifiedAnnos.filter(
          (anno: Annotation) => anno.classId === classItem._id
        ),
      }));

      state = {
        ...state,
        classes,
        src,
        imageId: _id,
      };

      return {
        ...state,
        selectedClassIndex: 0,
      };

    case EditorActionTypes.RESET_STATE:
      return initialState;

    case EditorActionTypes.SELECT_CLASS:
      return {
        ...state,
        selectedClassIndex: action.payload.classId,
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
      const { classIndex, classId, annotation } = action.payload;

      annotation.classId = classId;

      classes[classIndex].annotations.push(annotation);
      return {
        ...state,
        classes,
      };
    }

    case EditorActionTypes.UPDATE_ANNOTATION: {
      const { classes } = state;
      const { classId, annotationId, update } = action.payload;
      const annotations = classes[classId]?.annotations || [];

      for (let i = 0; i < annotations.length; i++) {
        if (annotations[i].id === annotationId) {
          if (
            update?.shapes &&
            (update?.shapes[0]?.type === TOOLS.RECTANGLE ||
              update?.shapes[0]?.type === TOOLS.LINE)
          ) {
            //id is important to change here as it's the key for the anno to be updated
            update.shapes[0].id = uniqid();
            classes[classId].annotations[i].shapes[0] = update.shapes[0];
          } else {
            classes[classId].annotations[i] = {
              ...annotations[i],
              ...update,
            };
          }
        }
      }
      return {
        ...state,
        classes,
      };
    }

    case EditorActionTypes.UPDATE_SHAPE: {
      const { classes } = state;
      const {
        newAttrs,
        selectedClassIndex,
      }: { newAttrs: Konva.ShapeConfig; selectedClassIndex: number } =
        action.payload;
      const shapeId = newAttrs?.id;
      const annotations: Annotation[] =
        classes[selectedClassIndex]?.annotations;
      if (annotations && typeof shapeId === 'string') {
        annotations.forEach((annotation: Annotation, i) => {
          annotation.shapes.forEach((shape, g) => {
            if (shape.id === shapeId) {
              classes[selectedClassIndex].annotations[i].shapes[g] = {
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
      if (comments?.length >= 0) state = { ...state, comments };
      return state;

    default:
      return state;
  }
};

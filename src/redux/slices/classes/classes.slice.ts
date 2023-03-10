import { createSlice, current } from '@reduxjs/toolkit';
import { ShapeConfig } from 'konva/lib/Shape';
import { Checks } from 'src/components/Editor/ClassesPanel';

// import _ from 'lodash';
import { Annotation, Class, TOOLS } from 'src/constants';
import uniqid from 'uniqid';

type State = {
  classes: Class[];
  history: [Class[]];
  highlightedInstance: string;
  historyStep: number;
  selectedClassIndex: number;
  currentAnnotationId: number | null;
  comments: { text: string; x: number; y: number; _id?: string }[];
  src: string;
  imageId: string;
  imageName: string;
  attributes: any;
  lastTimeUpdated: number; //? this flag is relied on as a factor to update logic when needed
  multiselectedAnnotators : any;
  checks : Checks
};

const initialState = {
  classes: [],
  history: [] as unknown as [Class[]],
  highlightedInstance: '',
  historyStep: 0,
  selectedClassIndex: 0,
  currentAnnotationId: 0,
  comments: [],
  src: '',
  imageId: '',
  imageName: '',
  attributes: {},
  lastTimeUpdated: 0,
  multiselectedAnnotators : [],
  checks: {}
} as State;

const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    initState: (state, action) => {
      if (
        !action.payload.state?.images ||
        action.payload.state?.images.length === 0 ||
        !action.payload?.state?.images[0]
      )
        return state;

      const { src, project, annotations, _id, fileName } = action.payload.state?.images[0];

      const purifiedAnnos = annotations?.map((anno: any) => {
        const { id, classId, shapes, visible, attributes } = anno;
        const purifiedShapes = shapes.map((shape: any) => {
          delete shape._id;
          delete shape.fill;
          return shape;
        });
        anno = { 
          id: id || uniqid(),
          classId,
          shapes: purifiedShapes,
          visible,
          attributes,
        };

        return anno;
      });

      let { classes } = project;
      classes = classes.map((classItem: Class) => ({
        ...classItem,
        annotations: purifiedAnnos.filter((anno: Annotation) => anno.classId === classItem._id),
      }));
      return {
        ...state,
        classes,
        history: [classes],
        historyStep: 0,
        comments: [],
        src,
        imageId: _id,
        imageName: fileName,
        selectedClassIndex: 0,
        lastTimeUpdated: new Date().getTime(),
      };
    },

    resetState: (state) => {
      state = initialState;
      return state;
    },

    selectClass: (state, action) => {
      state.selectedClassIndex = action.payload.classIndex;
    },

    setChecks: (state, action) => {
      state.checks = action.payload.newChecks;
    },

    setMultiselectAnnotators: (state, action) => {
      state.multiselectedAnnotators = action.payload.multiselectedAnnotatorsArray;
    },

    deleteAnnotation: (state, action) => {
      const { classId, annotationId } = action.payload;
      const { classes } = state;
      let annotations = classes[classId]?.annotations;
      annotations = annotations.filter((annotation: Annotation) => annotation.id !== annotationId);
      const newClasses = [] as Class[];

      classes.forEach((item, i) => {
        if (i === classId) item.annotations = annotations;
        newClasses.push(item);
      });
      state.classes = newClasses;
      state.history.push(newClasses);
      state.historyStep++;
      state.lastTimeUpdated = new Date().getTime();
    },

    addAnnotation: (state, action) => {
      const { classIndex, classId, annotation } = action.payload;

      annotation.classId = classId;
      const newShapes = annotation.shapes?.map((s: any) => {
        if (s.type !== TOOLS.RECTANGLE) return s;

        if (s.width > 0 && s.height > 0) return s;

        let newWidth = s.width;
        let newHeight = s.height;
        let newX = s.x;
        let newY = s.y;

        if (s.width < 0) {
          newX = s.x + s.width;
          newWidth = Math.abs(s.width);
        }

        if (s.height < 0) {
          newY = s.y + s.height;
          newHeight = Math.abs(s.height);
        }

        return { ...s, width: newWidth, height: newHeight, x: newX, y: newY };
      });

      annotation.shapes = newShapes;

      state.classes[classIndex].annotations.push(annotation);
      state.history.push(state.classes);
      state.historyStep++;
      state.lastTimeUpdated = new Date().getTime();
    },

    updateAnnotation: (state, action) => {
      // !Todo: refactor this
      const { classes } = state;
      const { classId, annotationId, update } = action.payload;
      const annotations = classes[classId]?.annotations || [];

      const index = state.classes[classId]?.annotations.findIndex((anno) => anno.id === annotationId);
      if (index === -1) return state;
      if (update?.shapes && update.shapes[0].type) {
        //id is important to change here as it's the key for the anno to be updated
        update.shapes[0].id = uniqid();
        classes[classId].annotations[index].shapes = update.shapes;
      } else if (update?.attributes) {
        const classIndex = classes.findIndex((classItem) => classItem._id === classId);
        const index = state.classes[classIndex]?.annotations.findIndex((anno) => anno.id === annotationId);
        if (classIndex === -1) return state;
        if (classes[classIndex]?.annotations[index]?.attributes)
          classes[classIndex].annotations[index].attributes = {
            ...classes[classIndex]?.annotations[index]?.attributes,
            ...update.attributes,
          };
      } else {
        classes[classId].annotations[index] = {
          ...annotations[index],
          ...update,
        };
      }
      state.classes = classes;
      state.history.push(classes);
      state.historyStep++;
      state.lastTimeUpdated = new Date().getTime();
    },

    //used for class panel bulk action
    toggleAnnotationVisibility: (state, action) => {
      const { classes } = state;
      const { annotationIds, visible } = action.payload;
      classes.forEach(cls => {
        cls.annotations.forEach((anno:any)=>{
          if (annotationIds.includes(anno.id)) {  
            anno.visible = visible;
          }
        })
      })
      state.classes = classes;
      state.history.push(classes);
      state.historyStep++;
      state.lastTimeUpdated = new Date().getTime();
    },

    //used for class panel bulk action
    deleteAnnotations: (state, action) => {
      const { classes } = state;
      const { annotationIds } = action.payload;
      classes.forEach(cls => {
        cls.annotations = cls.annotations.filter((anno) => !annotationIds.includes(anno.id));
      })
      state.classes = classes;
      state.lastTimeUpdated = new Date().getTime();
      state.history.push(classes);
      state.historyStep++;
    },

    //used for class panel bulk action
    changeAnnotationsClass: (state, action) => {
      const { classes } = state;
      const { oldClassIndex, newClassIndex, annotationIds } = action.payload;

      const newClassId = classes[newClassIndex]._id;

      const AllClassIndexes :number[] = [];
      classes.forEach((cls,index)=>{
        AllClassIndexes.push(index)
      })

      let newClassAnnotations = classes[newClassIndex]?.annotations || [];
      AllClassIndexes.forEach((index:number)=>{
      let currentClassAnnotations = classes[index]?.annotations || [];
      const newAnnos: Annotation[] = [];
      currentClassAnnotations = currentClassAnnotations.filter((anno) => {
        if (annotationIds.includes(anno.id) && anno.classId !== newClassId) {
          anno.classId = newClassId
          newAnnos.push(anno)
          return false
        }
        return true
      });
      
      classes[index].annotations = currentClassAnnotations;
      newClassAnnotations = [...newClassAnnotations, ...newAnnos];
      classes[newClassIndex].annotations = [...newClassAnnotations];
    })
      state.classes = classes;
      state.history.push(classes);
      state.historyStep++;
      state.lastTimeUpdated = new Date().getTime();
    },
    updateShape: (state, action) => {
      const { classes } = state;
      const { newAttrs, classItemName }: { newAttrs: ShapeConfig; classItemName: string } = action.payload;
      const shapeId = newAttrs?.id;

      const selectedClassIndex = classes.findIndex((classItem) => classItem.name === classItemName);
      if (selectedClassIndex === -1) return state;
      const annotations: Annotation[] = classes[selectedClassIndex]?.annotations;
      if (annotations && typeof shapeId === 'string') {
        let index = -1;
        for (let i = 0; i < annotations.length; i++) {
          index = annotations[i].shapes.findIndex((shape) => shape.id === shapeId);
          if (index !== -1) {
            classes[selectedClassIndex].annotations[i].shapes[index] = {
              ...annotations[i].shapes[index],
              ...newAttrs,
              id: uniqid(),
            } as any;
            break;
          }
        }

        state.classes = classes;
        state.history.push(classes);
        state.historyStep++;
        state.lastTimeUpdated = new Date().getTime();
      }
    },

    setComments: (state, action) => {
      const { newComments } = action.payload;
      if (newComments?.length >= 0) state.comments = newComments;
    },

    //go backward in annotations history
    undoHistory: (state) => {
      if (state.historyStep === 0) return state;
      state.historyStep--;
      state.classes = state.history[state.historyStep];
      state.lastTimeUpdated = new Date().getTime();
    },

    //go forward in annotations history
    redoHistory: (state) => {
      if (state.historyStep === state.history.length - 1) return state;
      state.historyStep++;
      state.classes = state.history[state.historyStep];
      state.lastTimeUpdated = new Date().getTime();
    },
    selectInstance: (state, action) => {
      const { classIndex, instanceId } = action.payload;
      if (classIndex >= 0 && typeof instanceId === 'string') {
        state.classes[classIndex].annotations.map((anno) => {
          if (anno.id === instanceId) {
            state.highlightedInstance = instanceId;
          }
        });
      }
    },
    deselectInstance: (state) => {
      state.highlightedInstance = '';
      state.multiselectedAnnotators = [];
    },
  },
});

export const {
  initState,
  resetState,
  selectClass,
  deleteAnnotation,
  addAnnotation,
  updateAnnotation,
  toggleAnnotationVisibility,
  deleteAnnotations,
  changeAnnotationsClass,
  updateShape,
  setComments,
  undoHistory,
  redoHistory,
  selectInstance,
  deselectInstance,
  setMultiselectAnnotators,
  setChecks
} = classesSlice.actions;
export default classesSlice.reducer;

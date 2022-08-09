import { EditorActionTypes } from './editor.types';
import { TOOLS, layers, Layer, Instance, Tool } from 'src/constants';
import Konva from 'konva';

type State = {
  tool: Tool;
  layers: Layer[];
  selectedLayerId: number;
  isDrawing: boolean;
  currentInstanceId: number | null;
  preview: string;
};

const initialState: State = {
  tool: TOOLS.RECTANGLE as Tool,
  layers,
  selectedLayerId: 0,
  isDrawing: true,
  currentInstanceId: 0, //!Unset this value later
  preview: '',
};

export const editorReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case EditorActionTypes.SET_TOOL:
      return {
        ...state,
        tool: action.payload.tool,
      };

    case EditorActionTypes.SELECT_LAYER:
      return {
        ...state,
        selectedLayerId: action.payload.layerId,
      };

    case EditorActionTypes.DELETE_INSTANCE: {
      const { layerId, instanceId } = action.payload;
      const { layers } = state;
      let instances = layers[layerId]?.instances;
      instances = instances.filter(
        (instance: Instance) => instance.id !== instanceId
      );
      const newLayers = [] as Layer[];

      layers.forEach((item, i) => {
        if (i === layerId) item.instances = instances;
        newLayers.push(item);
      });
      return {
        ...state,
        layers: newLayers,
      };
    }

    case EditorActionTypes.ADD_INSTANCE: {
      const { layers } = state;
      const { layerId, instance } = action.payload;
      layers[layerId].instances.push(instance);
      return {
        ...state,
        layers,
      };
    }

    case EditorActionTypes.UPDATE_INSTANCE: {
      const { layers } = state;
      const { layerId, instanceId, update } = action.payload;
      const instances = layers[layerId]?.instances;
      for (let i = 0; i < instances.length; i++) {
        if (instances[i].id === instanceId) {
          layers[layerId].instances[i] = {
            ...instances[i],
            ...update,
          };
        }
      }
      return {
        ...state,
        layers,
      };
    }
    case EditorActionTypes.START_DRAWING:
    case EditorActionTypes.End_DRAWING:
      return {
        ...state,
        isDrawing: action.type === EditorActionTypes.START_DRAWING,
      };

    case EditorActionTypes.ADD_SHAPE: {
      const { layerId, instanceId, shape } = action.payload;
      const layer = state.layers[layerId];
      const instance = layer?.instances[instanceId];
      instance.shapes.push([shape]);

      state.layers[layerId].instances[instanceId] = instance;
      return state;
    }

    case EditorActionTypes.UPDATE_SHAPE: {
      const { layers } = state;
      const {
        newAttrs,
        selectedLayerId,
      }: { newAttrs: Konva.ShapeConfig; selectedLayerId: number } =
        action.payload;
      const shapeId = newAttrs?.id;
      const instances: Instance[] = layers[selectedLayerId]?.instances;
      if (instances && typeof shapeId === 'string') {
        instances.forEach((instance: Instance, i) => {
          instance.shapes.forEach((group, g) => {
            group.forEach((shape, s) => {
              if (shape.id === shapeId) {
                layers[selectedLayerId].instances[i].shapes[g][s] = {
                  ...shape,
                  ...newAttrs,
                };
              }
            });
          });
        });
      }
      return {
        ...state,
        layers,
      };
    }

    case EditorActionTypes.ADD_ERASER_LINES: {
      const { layers } = state;
      const { layerId, rectId, lines } = action.payload;
      if (layerId != null) {
        layers[layerId].instances.forEach((instance: Instance, i) => {
          instance.shapes.forEach((shape, s) => {
            shape.forEach((item, r) => {
              if (item?.id === rectId) {
                layers[layerId].instances[i].shapes[s].push(...lines);
              }
            });
          });
        });
      }
      return {
        ...state,
        layers,
      };
    }

    case EditorActionTypes.SET_PREVIEW: {
      const { src } = action.payload;
      state.preview = src;
      return {
        ...state,
        preview: src,
      };
    }

    default:
      return state;
  }
};

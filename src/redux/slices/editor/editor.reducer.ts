import { EditorActionTypes } from './editor.types';
import { TOOLS, layers, Layer, Instance, Tool } from 'src/constants';

const initialState = {
  tool: TOOLS.PEN as Tool,
  layers,
  selectedLayerId: 0,
  isDrawing: true,
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
    case EditorActionTypes.START_DRAWING:
    case EditorActionTypes.End_DRAWING:
      return {
        ...state,
        isDrawing: action.type === EditorActionTypes.START_DRAWING,
      };

    case EditorActionTypes.ADD_ERASER_LINES: {
      const { layers } = state;
      const { layerId, rectId, lines } = action.payload;
      layers[layerId].instances.forEach((instance, i) => {
        instance.shapes.forEach((shape, s) => {
          shape.forEach((item, r) => {
            if (item?.id === rectId) {
              layers[layerId].instances[i].shapes[s].push(...lines);
            }
          });
        });
      });
      return {
        ...state,
        layers,
      };
    }

    default:
      return state;
  }
};

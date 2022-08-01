import { EditorActionTypes } from './editor.types';
import { TOOLS, layers, Mask, Instance } from 'src/constants';

const initialState = {
  tool: TOOLS.PEN,
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
        selectedLayerId: action.payload.maskId,
      };

    case EditorActionTypes.DELETE_INSTANCE: {
      const { maskId, instanceId } = action.payload;
      const { layers } = state;
      let instances = layers[maskId]?.instances;
      instances = instances.filter(
        (instance: Instance) => instance.id !== instanceId
      );
      const newLayers = [] as Mask[];

      layers.forEach((item, i) => {
        if (i === maskId) item.instances = instances;
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

    default:
      return state;
  }
};

import { EditorActionTypes } from './layers.types';
import { layers, Layer, Instance } from 'src/constants';
import Konva from 'konva';

type State = {
  layers: Layer[];
  selectedLayerId: number;
  currentInstanceId: number | null;
};

const initialState: State = {
  layers,
  selectedLayerId: 0,
  currentInstanceId: 0, //!Unset this value later
};

export const layersReducer = (state = initialState, action: any) => {
  switch (action.type) {
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
      if (!instances || instances.length === 0) return state;
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

    default:
      return state;
  }
};

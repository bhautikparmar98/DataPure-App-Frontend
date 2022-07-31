import { EditorActionTypes, IEditor } from './editor.types';
import { TOOLS, masks, Mask, Instance } from 'src/constants';

const initialState = {
  tool: TOOLS.PEN,
  masks,
  selectedMaskId: 0,
};

export const editorReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case EditorActionTypes.SET_TOOL:
      return {
        ...state,
        tool: action.payload.tool,
      };

    case EditorActionTypes.SELECT_MASK:
      return {
        ...state,
        selectedMaskId: action.payload.maskId,
      };

    case EditorActionTypes.DELETE_INSTANCE: {
      const { maskId, instanceId } = action.payload;
      const { masks } = state;
      let instances = masks[maskId]?.instances;
      instances = instances.filter(
        (instance: Instance) => instance.id !== instanceId
      );
      const newMasks = [] as Mask[];

      masks.forEach((item, i) => {
        if (i === maskId) item.instances = instances;
        newMasks.push(item);
      });
      return {
        ...state,
        masks: newMasks,
      };
    }

    case EditorActionTypes.ADD_INSTANCE: {
      const { masks } = state;
      const { maskId, instance } = action.payload;
      masks[maskId].instances.push(instance);
      return {
        ...state,
        masks,
      };
    }

    default:
      return state;
  }
};

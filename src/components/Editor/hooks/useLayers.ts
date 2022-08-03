import { Instance } from '../../../constants/layers';

import { useAppDispatch, useAppSelector } from 'src/redux/store';
import {
  selectLayer,
  addInstance as addInstanceAction,
  deleteInstance as deleteInstanceAction,
} from 'src/redux/slices/editor/editor.actions';

const useLayers = () => {
  const dispatch = useAppDispatch();

  const { layers, selectedLayerId } = useAppSelector(({ editor }) => editor);

  const setSelectedLayer = (e: any) => {
    const layerId = +e.target.value;
    dispatch(selectLayer(layerId));
  };

  const deleteInstance = (layerId: number, instanceId: string) => {
    dispatch(deleteInstanceAction(layerId, instanceId));
  };

  const addInstance = (layerId: number, instance: Instance) => {
    dispatch(addInstanceAction(layerId, instance));
  };

  return {
    layers,
    selectedLayerId,
    addInstance,
    deleteInstance,
    setSelectedLayer,
  };
};

export default useLayers;

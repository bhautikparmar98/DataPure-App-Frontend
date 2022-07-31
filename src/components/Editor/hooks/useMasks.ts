import { Instance } from '../../../constants/masks';

import { useAppDispatch, useAppSelector } from 'src/redux/store';
import {
  selectMask,
  addInstance as addInstanceAction,
  deleteInstance as deleteInstanceAction,
} from 'src/redux/slices/editor/editor.actions';

const useMasks = () => {
  const dispatch = useAppDispatch();

  const { masks, selectedMaskId } = useAppSelector(({ editor }) => editor);

  const setSelectedMask = (e: any) => {
    const maskId = +e.target.value;
    dispatch(selectMask(maskId));
  };

  const deleteInstance = (maskId: number, instanceId: string) => {
    dispatch(deleteInstanceAction(maskId, instanceId));
  };

  const addInstance = (maskId: number, instance: Instance) => {
    dispatch(addInstanceAction(maskId, instance));
  };

  return {
    masks,
    selectedMaskId,
    addInstance,
    deleteInstance,
    setSelectedMask,
  };
};

export default useMasks;

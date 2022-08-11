import Konva from 'konva';
import { useState } from 'react';
import { TOOLS } from 'src/constants';
import { deleteInstance } from 'src/redux/slices/layers/layers.actions';
import { useAppDispatch } from 'src/redux/store';
import useCursor from './useCursor';

const useKeyboard = (
  workspaceRef: React.RefObject<HTMLDivElement>,
  stageRef: React.RefObject<Konva.Stage>,
  selectedId: string
) => {
  const [stageDragging, setStageDragging] = useState(false);
  const { setCursorStyle } = useCursor(workspaceRef);

  const dispatch = useAppDispatch();

  const stage = stageRef.current;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!stage) return;

    switch (e.code) {
      case 'Space':
        return handlePanTool();
      case 'Delete':
        return handleShapeDeletion();

      default:
        break;
    }
  };

  const handlePanTool = () => {
    setCursorStyle(`url("/tools/${TOOLS.PAN}.svg"),auto`);
    setStageDragging(true);
  };

  const handleShapeDeletion = () => {
    if (!stage) return;
    const { layerId, instanceId } =
      stage.find('#' + selectedId)[0]?.parent?.attrs || {};
    if (layerId >= 0 && instanceId?.length > 0) {
      dispatch(deleteInstance(layerId, instanceId));
    }
  };

  const handleKeyUp = () => {
    setStageDragging(false);
    setCursorStyle();
  };

  return {
    handleKeyDown,
    handleKeyUp,
    stageDragging,
  };
};
export default useKeyboard;

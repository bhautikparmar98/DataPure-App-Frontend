import Konva from 'konva';
import { useState } from 'react';
import { TOOLS } from 'src/constants';
import useCursor from './useCursor';

const useKeyboard = (
  workspaceRef: React.RefObject<HTMLDivElement>
  // stageRef: React.RefObject<Konva.Stage>
) => {
  const [stageDragging, setStageDragging] = useState(false);
  const { setCursorStyle } = useCursor(workspaceRef);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === 'Space') {
      setCursorStyle(`url("/tools/${TOOLS.PAN}.svg"),auto`);
      setStageDragging(true);
    }
  };

  const handleKeyUp = () => {
    setStageDragging(false);
    setCursorStyle();
  };

  // !work on this
  const handleInstanceDeletion = (e: any) => {
    console.log(e);
  };

  return {
    handleKeyDown,
    handleKeyUp,
    stageDragging,
    handleInstanceDeletion,
  };
};
export default useKeyboard;

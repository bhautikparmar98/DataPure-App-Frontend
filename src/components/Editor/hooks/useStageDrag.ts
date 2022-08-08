import { useState } from 'react';
import { TOOLS } from 'src/constants';
import useCursor from './useCursor';

const useStageDrag = (workspaceRef: React.RefObject<HTMLDivElement>) => {
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

  return {
    handleKeyDown,
    handleKeyUp,
    stageDragging,
  };
};
export default useStageDrag;

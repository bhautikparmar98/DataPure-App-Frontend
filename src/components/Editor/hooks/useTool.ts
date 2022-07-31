import React, { useEffect } from 'react';
import { useAppSelector } from 'src/redux/store';

const useTool = (workspaceRef: React.RefObject<HTMLDivElement>) => {
  const currentTool = useAppSelector((state) => state.editor.tool);

  const setCursorStyle = (cursorStyle?: string) => {
    if (workspaceRef.current?.style) {
      workspaceRef.current.style.cursor = cursorStyle
        ? cursorStyle
        : `url("/tools/${currentTool}.svg"),auto`;
    }
  };
  useEffect(() => {
    setCursorStyle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTool]);

  return { setCursorStyle };
};

export default useTool;

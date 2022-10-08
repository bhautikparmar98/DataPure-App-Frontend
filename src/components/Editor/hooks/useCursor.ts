import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { TOOLS } from 'src/constants';
import { RootState } from 'src/redux/store';
const useCursor = (workspaceRef: React.RefObject<HTMLDivElement>) => {
  const currentTool = useSelector<RootState>((state) => state.editor.tool);

  // const toolName =
  // currentTool === TOOLS.ERASER ? 'eraser-working' : currentTool;

  const setCursorStyle = (cursorStyle?: string) => {
    if (workspaceRef.current?.style) {
      workspaceRef.current.style.cursor = cursorStyle
        ? cursorStyle
        : currentTool === TOOLS.LINE
        ? 'default'
        : `url("/tools/${currentTool}.svg"),auto`;
    }
  };
  useEffect(() => {
    setCursorStyle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTool]);

  return { setCursorStyle };
};

export default useCursor;

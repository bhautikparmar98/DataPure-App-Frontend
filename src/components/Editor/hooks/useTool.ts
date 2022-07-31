import React, { useEffect } from 'react';
import { useAppSelector } from 'src/redux/store';

const useTool = (workspaceRef: React.RefObject<HTMLDivElement>) => {
  const currentTool = useAppSelector(({ editor }) => editor.tool);

  const setCursorStyle = (cursorStyle?: string) => {
    if (workspaceRef.current?.style) {
      console.log({ cursorStyle });
      workspaceRef.current.style.cursor = cursorStyle
        ? cursorStyle
        : `url("/tools/${currentTool}.svg"),auto`;
      console.log(
        cursorStyle ? cursorStyle : `url("/tools/${currentTool}.svg"),auto`
      );
    }
  };
  useEffect(() => {
    setCursorStyle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTool]);

  return { setCursorStyle };
};

export default useTool;

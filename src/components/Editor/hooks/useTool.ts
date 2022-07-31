import React, { useEffect } from 'react';
import { useAppSelector } from 'src/redux/store';

const useTool = (workspaceRef: React.RefObject<HTMLDivElement>) => {
  const currentTool = useAppSelector(({ editor }) => editor.tool);
  useEffect(() => {
    if (workspaceRef.current?.style) {
      workspaceRef.current.style.cursor = `url("/tools/${currentTool}.svg"),auto`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTool]);
};

export default useTool;

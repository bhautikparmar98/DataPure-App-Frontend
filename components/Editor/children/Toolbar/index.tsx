import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from 'redux/store';
import { setTool } from 'redux/slices/editor';
import { TOOLS, type Tool } from '@constants';

const Toolbar = () => {
  const currentState = useAppSelector((state) => state.editor);
  const [currentTool, setCurrentTool] = useState<Tool>(TOOLS.PEN);

  const dispatch = useAppDispatch();

  useEffect(() => {
    setCurrentTool(currentState.tool);
  }, [currentState.tool]);

  const handleClick = () => {
    dispatch(setTool(TOOLS.PEN_TOOL));
  };

  return (
    <div>
      <button onClick={handleClick}>Choose PenTool</button>
      Current Tool: {currentTool}
    </div>
  );
};
export default Toolbar;

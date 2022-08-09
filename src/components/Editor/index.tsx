import { useRef } from 'react';
import useKeyboard from './hooks/useKeyboard';
import LayersPanel from './LayersPanel';
import Toolbar from './Toolbar';
import Workspace from './Workspace';

const Editor = () => {
  const containerRef = useRef(null);
  const { handleKeyDown, handleKeyUp, stageDragging } =
    useKeyboard(containerRef);

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      onKeyUp={handleKeyUp}
    >
      <Toolbar />
      <div style={{ marginLeft: 70 }}>
        <Workspace stageDragging={stageDragging} />
      </div>
      <LayersPanel />
    </div>
  );
};
export default Editor;

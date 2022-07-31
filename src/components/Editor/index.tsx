import MasksPanel from './MasksPanel';
import Toolbar from './Toolbar';
import Workspace from './Workspace';

const Editor = () => {
  return (
    <div>
      <MasksPanel />
      <Toolbar />
      <div style={{ marginLeft: 70 }}>
        <Workspace />
      </div>
    </div>
  );
};
export default Editor;

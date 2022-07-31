import MasksPanel from './MasksPanel';
import Toolbar from './Toolbar';
import Workspace from './Workspace';

const Editor = () => (
  <div style={{ marginLeft: 70 }}>
    <MasksPanel />
    <Toolbar />
    <div>
      <Workspace />
    </div>
  </div>
);

export default Editor;

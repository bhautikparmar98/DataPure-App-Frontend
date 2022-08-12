import ClassesPanel from './ClassesPanel';
import Toolbar from './Toolbar';
import Workspace from './Workspace';

const Editor = () => (
  <div>
    <Toolbar />
    <div style={{ marginLeft: 70 }}>
      <Workspace />
    </div>
    <ClassesPanel />
  </div>
);
export default Editor;

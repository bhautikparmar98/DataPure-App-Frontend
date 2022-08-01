import LayersPanel from './LayersPanel';
import Toolbar from './Toolbar';
import Workspace from './Workspace';

const Editor = () => (
  <div style={{ marginLeft: 70 }}>
    <LayersPanel />
    <Toolbar />
    <div>
      <Workspace />
    </div>
  </div>
);

export default Editor;

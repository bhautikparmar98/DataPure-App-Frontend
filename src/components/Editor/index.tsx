import LayersPanel from './LayersPanel';
import Toolbar from './Toolbar';
import Workspace from './Workspace';

const Editor = () => (
  <div>
    <Toolbar />
    <div style={{ marginLeft: 70 }}>
      <Workspace />
    </div>
    <LayersPanel />
  </div>
);

export default Editor;

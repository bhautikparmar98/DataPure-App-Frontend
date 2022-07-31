import Toolbar from './children/Toolbar';
import Workspace from './children/Workspace';

const Editor = () => {
  return (
    <div>
      <Toolbar />
      <div style={{ marginLeft: 70 }}>
        <Workspace />
      </div>
    </div>
  );
};
export default Editor;

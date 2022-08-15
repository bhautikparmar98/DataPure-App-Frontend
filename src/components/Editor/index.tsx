import ClassesPanel from './ClassesPanel';
import useFetchImage from './hooks/useFetchImage';
import Toolbar from './Toolbar';
import Workspace from './Workspace';
import { useRouter } from 'next/router';

const Editor = () => {
  const router = useRouter();
  const query = router.query;

  const id = query.id as string;

  useFetchImage(id);
  return (
    <div>
      <Toolbar />
      <div style={{ marginLeft: 70 }}>
        <Workspace />
      </div>
      <ClassesPanel />
    </div>
  );
};
export default Editor;

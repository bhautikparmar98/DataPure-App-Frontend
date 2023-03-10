import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import Page from 'src/components/Shared/Page';
import AuthGuard from 'src/guards/AuthGuard';
const Editor = dynamic(() => import('src/components/Editor'), { ssr: false });

const EditorPage = () => {
  const router = useRouter();
  const query = router.query;

  const projectId: string[] | string | undefined = query.id;

  if (!projectId) {
    return {
      notFound: true,
    };
  }

  return (
    <Page title="Editor">
      <AuthGuard>
        <Editor />
      </AuthGuard>
    </Page>
  );
};
export default EditorPage;

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { IProject } from 'src/components/Project/List/types/project';
import Page from 'src/components/Shared/Page';
import AuthGuard from 'src/guards/AuthGuard';
import axiosInstance from 'src/utils/axios';
const Editor = dynamic(() => import('src/components/Editor'), { ssr: false });

const EditorPage = () => {
  const router = useRouter();
  const [project, setProject] = useState<IProject | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const query = router.query;

  const projectId = query.id;

  if (!projectId) {
    return {
      notFound: true,
    };
  }

  const getProject = async (projectId: number | string) => {
    try {
      const response = await axiosInstance.get(`/project/${projectId}`);
      const { project } = response.data;

      setProject(project);
    } catch (error) {
      console.log('error', error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  useEffect(() => {
    if (projectId) getProject(projectId);
  }, [projectId]);
  return (
    <Page title="Editor">
      <AuthGuard>
        <Editor project={project} />
      </AuthGuard>
    </Page>
  );
};
export default EditorPage;

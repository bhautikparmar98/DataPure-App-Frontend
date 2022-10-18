import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { IProject } from 'src/components/Project/List/types/project';
import axiosInstance from 'src/utils/axios';
import { useRouter } from 'next/router';

const useAttributes = () => {
  const router = useRouter();
  const query = router.query;

  const projectId: string[] | string | undefined = query.id;

  const { enqueueSnackbar } = useSnackbar();
  const [project, setProject] = useState<IProject | null>(null);
  const getProject = async (projectId: string[] | string | undefined) => {
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
    // const id = projectId ? projectId : localStorage.getItem('projectId');
    if (typeof window !== undefined) {
      setTimeout(() => {
        getProject(projectId);
      }, 0);
    }
  }, []);

  return {
    project,
  };
};

export default useAttributes;

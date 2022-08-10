import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import axiosInstance from 'src/utils/axios';
import { IProject } from '../types/project';

const useQALogic = () => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [projects, setProjects] = useState<IProject[]>([]);
  const [counts, setCounts] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const startHandler = (project: IProject) => {
    //TODO: move to the editor
  };

  useEffect(() => {
    const getQAProjects = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/user/qa/project`);
        const { projects, QACounts } = response.data;

        const updatedCounts = {};
        QACounts.forEach((count: any) => {
          updatedCounts[count.projectId as any] = count;
        });

        setCounts(updatedCounts);

        setProjects(projects);
      } catch (error) {
        console.log('error getting admin projects', error);
        enqueueSnackbar('Something went wrong.', { variant: 'error' });
      }
      setLoading(false);
    };

    getQAProjects();
  }, []);

  return {
    projects,
    loading,
    startHandler,
    counts,
  };
};

export default useQALogic;

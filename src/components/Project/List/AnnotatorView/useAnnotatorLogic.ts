import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import axiosInstance from 'src/utils/axios';
import { IProject } from '../types/project';

const useAnnotatorLogic = () => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [projects, setProjects] = useState<IProject[]>([]);
  const [counts, setCounts] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const startHandler = (project: IProject) => {
    //TODO: move to the editor
  };

  const redoHandler = (project: IProject) => {
    // TODO: handle redo in the edit
  };

  useEffect(() => {
    const getAnnotatorProjects = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/user/annotator/project`);
        const { projects, annotatorCounts } = response.data;

        const updatedCounts = {};
        annotatorCounts.forEach((count: any) => {
          updatedCounts[count.projectId as any] = count;
        });

        setCounts(updatedCounts);

        setProjects(projects);
      } catch (error) {
        console.log('error getting annotator projects', error);
        enqueueSnackbar('Something went wrong.', { variant: 'error' });
      }
      setLoading(false);
    };

    getAnnotatorProjects();
  }, []);

  return {
    projects,
    loading,
    startHandler,
    counts,
    redoHandler,
  };
};

export default useAnnotatorLogic;

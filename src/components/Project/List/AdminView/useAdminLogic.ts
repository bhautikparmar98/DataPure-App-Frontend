import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import useAuth from 'src/hooks/useAuth';
import axiosInstance from 'src/utils/axios';
import { IProject } from '../types/project';

const useAdminLogic = () => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [projects, setProjects] = useState<IProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  const [QAs, setQAs] = useState<any[]>([]);
  const [annotators, setAnnotators] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [editTeamModalOpened, setEditTeamModalOpened] = useState(false);

  const editTeamHandler = (project: IProject) => {
    setEditTeamModalOpened(true);
    setSelectedProject(project);
  };

  const viewDataSetHandler = (id: string) => {
    router.push(`/project/${id}/dataset`);
  };

  const downloadOutputHandler = (projectId: string) => {};

  const closeEditModalHandler = () => {
    setEditTeamModalOpened(false);
    setSelectedProject(null);
  };

  const assignTaskFinishHandler = (
    qaIds: number[],
    annotatorsIds: number[]
  ) => {
    const updatedProjects = [...projects];
    const index = updatedProjects.findIndex(
      (p) => p._id === selectedProject?._id
    );

    if (index === -1) {
      console.log('SelectedProject is not found');
    }

    updatedProjects[index].assignedQAs = qaIds;
    updatedProjects[index].assignedAnnotators = annotatorsIds;
    setProjects(updatedProjects);

    // close modal
    closeEditModalHandler();
  };

  useEffect(() => {
    const getQAs = async () => {
      try {
        const response = await axiosInstance.get('/user/qa');
        const { qas } = response.data;

        setQAs(qas);
      } catch (error) {
        console.log('error', error);
        enqueueSnackbar('Something went wrong.', { variant: 'error' });
      }
    };

    const getAnnotators = async () => {
      try {
        const response = await axiosInstance.get('/user/annotator');
        const { annotators } = response.data;

        setAnnotators(annotators);
      } catch (error) {
        console.log('error getting annotators', error);
        enqueueSnackbar('Something went wrong.', { variant: 'error' });
      }
    };

    const getAdminProjects = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/user/admin/project`);
        const { projects } = response.data;

        setProjects(projects);
      } catch (error) {
        console.log('error getting admin projects', error);
        enqueueSnackbar('Something went wrong.', { variant: 'error' });
      }
      setLoading(false);
    };

    getAdminProjects();
    getQAs();
    getAnnotators();
  }, []);

  return {
    projects,
    selectedProject,
    QAs,
    annotators,
    loading,
    editTeamModalOpened,
    editTeamHandler,
    viewDataSetHandler,
    downloadOutputHandler,
    closeEditModalHandler,
    assignTaskFinishHandler,
  };
};

export default useAdminLogic;

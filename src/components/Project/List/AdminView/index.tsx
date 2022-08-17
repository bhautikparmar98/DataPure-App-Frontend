import { Alert, AlertTitle, Box, Container } from '@mui/material';
import useSettings from 'src/hooks/useSettings';
import ProjectGrid from '../Shared/ProjectGrid';
import { IProject } from '../types/project';
import EditTeamModal from './EditTeamModal';
import ProjectListHeader from './Header';
import AdminProjectStatistics from './Statistics';
import useAdminLogic from './useAdminLogic';

const AdminProjectsComponents = () => {
  const { themeStretch } = useSettings();
  const {
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
    downloadLoading,
  } = useAdminLogic();

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <ProjectListHeader />

      <EditTeamModal
        open={editTeamModalOpened}
        onClose={closeEditModalHandler}
        users={[...QAs, ...annotators].sort((a, b) => a.id - b.id)}
        selectedProject={selectedProject}
        onAssignFinish={assignTaskFinishHandler}
      />

      <Box sx={{ mt: 4 }}>
        {!loading && projects.length === 0 && (
          <Alert severity="info">
            <AlertTitle>No Projects</AlertTitle>
            You don't have any projects yet, please ask for one.
          </Alert>
        )}

        <ProjectGrid
          projects={projects}
          renderStatistics={(project) => (
            <AdminProjectStatistics project={project} />
          )}
          actions={[
            {
              label: '',
              action: (project: IProject) => downloadOutputHandler(project),
              variant: 'icon',
              icon: 'ant-design:download-outlined',
              disabled: downloadLoading,
            },
            {
              label: 'View Dataset',
              action: (project: IProject) => viewDataSetHandler(project._id!),
              variant: 'outlined',
            },
            {
              label: 'Edit Team',
              action: (project: IProject) => editTeamHandler(project),
              variant: 'contained',
            },
          ]}
        />
      </Box>
    </Container>
  );
};

export default AdminProjectsComponents;

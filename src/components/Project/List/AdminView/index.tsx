import { Alert, AlertTitle, Box, Container, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import useSettings from 'src/hooks/useSettings';
import axiosInstance from 'src/utils/axios';
import ProjectGrid from '../Shared/ProjectGrid';
import { IProject } from '../types/project';
import EditTeamModal from './EditTeamModal';
import AssignAdminModal from './EditTeamModal';
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
          onDownloadOutput={downloadOutputHandler}
          renderStatistics={(project) => (
            <AdminProjectStatistics project={project} />
          )}
          actions={[
            {
              label: '',
              action: (project: IProject) =>
                downloadOutputHandler(project._id!),
              variant: 'icon',
              icon: 'ant-design:download-outlined',
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

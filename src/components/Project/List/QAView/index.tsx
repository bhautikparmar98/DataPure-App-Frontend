import { Alert, AlertTitle, Box, Container } from '@mui/material';
import useSettings from 'src/hooks/useSettings';
import ProjectGrid from '../Shared/ProjectGrid';
import { IProject } from '../types/project';
import ProjectListHeader from './Header';
import QAProjectStatistics from './QAStatics';
import useQALogic from './useQALogic';

const QAProjectsComponents = () => {
  const { themeStretch } = useSettings();
  const { projects, loading, startHandler, counts } = useQALogic();

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <ProjectListHeader />

      <Box sx={{ mt: 4 }}>
        {!loading && projects.length === 0 && (
          <Alert severity='info'>
            <AlertTitle>No Projects</AlertTitle>
            You don't have any projects yet, please ask for one.
          </Alert>
        )}

        <ProjectGrid
          projects={projects}
          removeProgress
          renderStatistics={(project) => (
            <QAProjectStatistics
              pendingQA={counts[project._id!]?.pendingQA}
              submitted={counts[project._id!]?.submitted}
            />
          )}
          actions={[
            {
              label: 'Start',
              action: (project: IProject) => startHandler(project),
              variant: 'contained',
            },
          ]}
        />
      </Box>
    </Container>
  );
};

export default QAProjectsComponents;

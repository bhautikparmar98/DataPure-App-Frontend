import { Alert, AlertTitle, Box, Container } from '@mui/material';
import useSettings from 'src/hooks/useSettings';
import ProjectGrid from '../Shared/ProjectGrid';
import { IProject } from '../types/project';
import ProjectListHeader from './Header';
import AnnotatorProjectStatistics from './AnnotatorStatics';
import useAnnotatorLogic from './useAnnotatorLogic';

const AnnotatorProjectsComponents = () => {
  const { themeStretch } = useSettings();
  const { projects, loading, startHandler, counts, redoHandler } =
    useAnnotatorLogic();

  console.log({ projects });
  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <ProjectListHeader />

      <Box sx={{ mt: 4 }}>
        {!loading && projects.length === 0 && (
          <Alert severity="info">
            <AlertTitle>No Projects</AlertTitle>
            You don't have any projects yet, please ask for one.
          </Alert>
        )}

        <ProjectGrid
          projects={projects}
          calcProgress={(project: IProject) => {
            const { pendingAnnotation, submitted } = counts[project._id as any];

            if (submitted + pendingAnnotation === 0) return 100;

            return Math.round(
              (submitted / (submitted + pendingAnnotation)) * 100
            );
          }}
          getProgressLabel={(project) => {
            const { pendingAnnotation, submitted } = counts[project._id as any];

            return `Progress ${submitted} / ${submitted + pendingAnnotation}`;
          }}
          renderStatistics={(project) => (
            <AnnotatorProjectStatistics
              redoHandler={() => redoHandler(project)}
              pendingRedo={counts[project._id!]?.pendingRedo}
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

export default AnnotatorProjectsComponents;

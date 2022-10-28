import { Grid } from '@mui/material';
import React from 'react';
import useSettings from 'src/hooks/useSettings';
import MinimizedProjectCard from '../MinimizedProjectCard';

// types
import { IProject } from '../../types/project';

interface ProjectBodyListProps {
  projects: IProject[];
  syncProjectData?: () => {};

  renderStatistics?: (project: IProject) => React.ReactNode;
  actions: {
    label: string;
    action: (p: IProject) => void;
    variant: 'contained' | 'icon' | 'outlined';
    icon?: string;
    color?: 'inherit' | 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    disabled?: boolean;
  }[];
  removeProgress?: boolean;
  calcProgress?: (p: IProject) => number;
  getProgressLabel?: (p: IProject) => string;
  metaButton?: boolean;
}
const ProjectGrid: React.FC<ProjectBodyListProps> = ({
  projects,
  syncProjectData,
  renderStatistics,
  removeProgress,
  actions,
  calcProgress,
  getProgressLabel,
  metaButton,
}) => {
  const { themeStretch } = useSettings();

  return (
    <Grid container spacing={2}>
      {projects.map((p) => (
        <Grid item xl={themeStretch ? 3 : 4} lg={4} md={4} sm={6} xs={12} key={p._id}>
          <MinimizedProjectCard
            project={p}
            syncProjectData={syncProjectData}
            removeProgress={removeProgress}
            calcProgress={calcProgress}
            renderStatistics={renderStatistics}
            actions={actions}
            getProgressLabel={getProgressLabel}
            metaButton={metaButton}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProjectGrid;

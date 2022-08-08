import { Grid } from '@mui/material';
import React from 'react';
import useSettings from 'src/hooks/useSettings';
import MinimizedProjectCard from '../MinimizedProjectCard';

// types
import { IProject } from '../../types/project';

interface ProjectBodyListProps {
  projects: IProject[];

  onDownloadOutput: (id: string) => void;
  renderStatistics?: (project: IProject) => React.ReactNode;
  actions: {
    label: string;
    action: (p: IProject) => void;
    variant: 'contained' | 'icon' | 'outlined';
    icon?: string;
  }[];
}
const ProjectGrid: React.FC<ProjectBodyListProps> = ({
  projects,
  renderStatistics,
  actions,
}) => {
  const { themeStretch } = useSettings();

  return (
    <Grid container spacing={2}>
      {projects.map((p) => (
        <Grid
          item
          xl={themeStretch ? 3 : 4}
          lg={4}
          md={4}
          sm={6}
          xs={12}
          key={p._id}
        >
          <MinimizedProjectCard
            project={p}
            renderStatistics={renderStatistics}
            actions={actions}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProjectGrid;

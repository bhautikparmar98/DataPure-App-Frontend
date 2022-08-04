import { Grid } from '@mui/material';
import React from 'react';
import useSettings from 'src/hooks/useSettings';
import MinimizedProjectCard from '../../Shared/MinimizedProjectCard';

// types
import { IProject } from '../../types/project';

interface ProjectBodyListProps {
  projects: IProject[];

  onDownloadOutput: (id: string) => void;
}
const ProjectBodyList: React.FC<ProjectBodyListProps> = ({
  projects,
  onDownloadOutput,
}) => {
  const { themeStretch } = useSettings();
  const viewDataSetHandler = (id: string) => {
    // TODO: go to the dataset view page
  };

  const reviewHandler = (id: string) => {
    // TODO: go the review page
  };

  return (
    <Grid container spacing={2}>
      {projects.map((p) => (
        <>
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
              onDownloadOutput={onDownloadOutput}
              onReviewProject={reviewHandler}
              onViewDataSet={viewDataSetHandler}
            />
          </Grid>
        </>
      ))}
    </Grid>
  );
};

export default ProjectBodyList;

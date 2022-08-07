import { Grid } from '@mui/material';
import { useRouter } from 'next/router';
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
  const router = useRouter();

  const viewDataSetHandler = (id: string) => {
    router.push(`/project/${id}/dataset`);
  };

  const reviewHandler = (id: string) => {
    router.push(`/project/${id}/review`);
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

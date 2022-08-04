import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { IProject } from '../../types/project';
import { fDate } from 'src/utils/formatTime';
import { ANNOTATION_TYPES } from 'src/constants';
import Iconify from 'src/components/Shared/Iconify';

interface MinimizedProjectCardProps {
  project: IProject;
  onDownloadOutput: (id: string) => void;
  onViewDataSet: (id: string) => void;
  onReviewProject: (id: string) => void;
}

const MinimizedProjectCard: React.FC<MinimizedProjectCardProps> = ({
  project,
  onDownloadOutput,
  onViewDataSet,
  onReviewProject,
}) => {
  const theme = useTheme();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" color={theme.palette.primary.main}>
          {project.name}
        </Typography>

        <Box my={1}>
          <Typography variant="body2">
            <strong>Due By: </strong>
            <span style={{ color: theme.palette.text.secondary }}>
              {fDate(project.dueAt)}
            </span>

            <strong style={{ marginLeft: 5 }}>Type: </strong>
            <span style={{ color: theme.palette.text.secondary }}>
              {
                ANNOTATION_TYPES[project.type as keyof typeof ANNOTATION_TYPES]
                  ?.label
              }
            </span>
          </Typography>
        </Box>

        <Box my={1}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="body2" color={theme.palette.secondary.main}>
                <strong>Progress</strong>
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color={theme.palette.secondary.main}>
                <strong>
                  {Math.round((project.doneCount / project.imagesCount) * 100)}%
                </strong>
              </Typography>
            </Box>
          </Box>

          <LinearProgress
            variant="determinate"
            value={(project.doneCount / project.imagesCount) * 100}
            color="secondary"
          />
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <IconButton
            color="primary"
            edge="end"
            onClick={() => onDownloadOutput(project._id)}
          >
            <Iconify icon={'ant-design:download-outlined'} />
          </IconButton>

          <Button
            variant="outlined"
            color="primary"
            onClick={() => onViewDataSet(project._id)}
          >
            View Dataset
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => onReviewProject(project._id)}
          >
            Review
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MinimizedProjectCard;

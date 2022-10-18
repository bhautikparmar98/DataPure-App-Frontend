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
import MetaDataCreationModel from '../MetaDataCreationModel';

interface MinimizedProjectCardProps {
  project: IProject;
  syncProjectData?: any;
  renderStatistics?: (project: IProject) => React.ReactNode;
  actions: {
    label: string;
    action: (p: IProject) => void;
    variant: 'contained' | 'icon' | 'outlined';
    icon?: string;
    disabled?: boolean;
  }[];
  removeProgress?: boolean;
  calcProgress?: (p: IProject) => number;
  getProgressLabel?: (p: IProject) => string;
  metaButton?: boolean;
}

const MinimizedProjectCard: React.FC<MinimizedProjectCardProps> = ({
  project,
  syncProjectData,
  renderStatistics,
  actions,
  removeProgress,
  calcProgress,
  getProgressLabel,
  metaButton,
}) => {
  const theme = useTheme();

  let progress = Math.round(
    ((project.doneCount + project.clientReviewCount) / project.imagesCount) *
      100
  );
  if (calcProgress) progress = calcProgress(project);
  if (progress > 100) progress = 100; //!remove this later
  if (isNaN(progress)) progress = 0;
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" color={theme.palette.primary.main}>
            {project.name}
          </Typography>
          {metaButton && (
            <MetaDataCreationModel
              project={project}
              syncProjectData={syncProjectData}
            />
          )}
        </Box>
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
        {!removeProgress && (
          <Box my={1}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center">
              <Box>
                <Typography
                  variant="body2"
                  fontSize={12}
                  color={theme.palette.secondary.main}>
                  <strong>
                    {getProgressLabel ? getProgressLabel(project) : 'Progress'}
                  </strong>
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  color={theme.palette.secondary.main}>
                  <strong>{progress}%</strong>
                </Typography>
              </Box>
            </Box>

            <LinearProgress
              variant="determinate"
              value={progress}
              color="secondary"
            />
          </Box>
        )}{' '}
        {renderStatistics && renderStatistics(project)}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}>
          {actions.map((a, index) => {
            if (a.variant === 'icon') {
              return (
                <IconButton
                  color="primary"
                  edge="end"
                  key={index}
                  onClick={() => a.action(project)}>
                  <Iconify icon={a.icon as any} />
                </IconButton>
              );
            }

            return (
              <Button
                key={index}
                variant={a.variant as any}
                color="primary"
                onClick={() => a.action(project)}>
                {a.label}
              </Button>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MinimizedProjectCard;

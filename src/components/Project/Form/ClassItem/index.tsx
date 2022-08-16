import { IconButton, Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import Iconify from 'src/components/Shared/Iconify';
import { IProjectClass } from '../../List/types/project';

interface ClassItemProps {
  item: IProjectClass;
  onDelete: () => void;
}

const ClassItem: React.FC<ClassItemProps> = ({ item, onDelete }) => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        backgroundColor: theme.palette.grey[200],
        paddingX: '10px',
        paddingY: '5px',
      }}
    >
      <Box display="flex">
        <Box
          sx={{
            borderRadius: '50%',
            backgroundColor: item.color,
            width: 25,
            height: 25,
            marginRight: 1,
          }}
        />

        <Typography variant="body2" fontSize={16}>
          {item.name}
        </Typography>
      </Box>

      <Box>
        <IconButton onClick={onDelete} edge="end">
          <Iconify icon={'bi:x'} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ClassItem;

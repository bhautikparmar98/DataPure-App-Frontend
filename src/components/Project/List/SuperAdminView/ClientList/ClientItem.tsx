import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { ListItemButton, useTheme } from '@mui/material';

interface ClientItemProps {
  item: any;
  onSelect: (selectedUserId: number) => void;
  selectedClientId: number | null;
  latest: boolean;
}

export default function ClientItem({
  item,
  onSelect,
  selectedClientId,
  latest,
}: ClientItemProps) {
  const theme = useTheme();
  return (
    <ListItemButton
      selected={item.id === selectedClientId}
      onClick={() => onSelect(item.id)}
      alignItems="flex-start"
      sx={{
        py: 3,
        px: 3,
        borderTop: `1px solid ${theme.palette.grey[300]}`,
        borderBottom: latest ? `1px solid ${theme.palette.grey[300]}` : 'none',
      }}
    >
      <ListItemText
        primary={item.fullName}
        primaryTypographyProps={{
          fontSize: 14,
          fontWeight: 'medium',
        }}
      />
    </ListItemButton>
  );
}

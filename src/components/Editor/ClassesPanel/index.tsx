import React from 'react';
// MUI
import Drawer from '@mui/material/Drawer';
import { Container } from '@mui/material';
import Preview from './Preview';
import Filters from './Filters';
import Annotations from './Annotations';
import SubmitAnnotations from './SubmitAnnotations';

const ClassPanel = () => (
  <div style={{ cursor: 'default' }}>
    <Drawer
      variant="permanent"
      anchor={'right'}
      open={true}
      PaperProps={{
        sx: {
          backgroundColor: '#F6F6F6',
        },
      }}
    >
      <Container
        sx={{
          width: 300,
          paddingTop: 2,
          paddingBottom: 8,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Preview />
        <Filters />
        <Annotations />
        <SubmitAnnotations />
      </Container>
    </Drawer>
  </div>
);
export default ClassPanel;

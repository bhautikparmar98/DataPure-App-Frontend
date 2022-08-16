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
          minHeight: '90vh',
        }}
      >
        <Preview />
        <Filters />
        <Annotations />
      </Container>
      <SubmitAnnotations />
    </Drawer>
  </div>
);
export default ClassPanel;

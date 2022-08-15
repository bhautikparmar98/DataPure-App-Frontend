import React from 'react';
// MUI
import Drawer from '@mui/material/Drawer';
import { Container } from '@mui/material';
import Preview from './Preview';
import Filters from './Filters';
import Annotations from './Annotations';

const ClassPanel = () => (
  <div style={{ cursor: 'default' }}>
    <Drawer variant="permanent" anchor={'right'} open={true}>
      <Container
        sx={{
          width: 300,
          paddingTop: 2,
          backgroundColor: '#F6F6F6',
          minHeight: '100vh',
        }}
      >
        <Preview />
        <Filters />
        <Annotations />
        {/* <SubmitAnnotations/> */}
      </Container>
    </Drawer>
  </div>
);
export default ClassPanel;

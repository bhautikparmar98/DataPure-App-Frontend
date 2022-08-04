import React from 'react';
// MUI
import Drawer from '@mui/material/Drawer';

import Content from './Content';

const LayersPanel = () => (
  <div>
    <Drawer variant="permanent" anchor={'right'} open={true}>
      <Content />
    </Drawer>
  </div>
);
export default LayersPanel;

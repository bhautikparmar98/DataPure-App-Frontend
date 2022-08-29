import React from 'react';
// MUI
import { Container } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import Annotations from './Annotations';
import Filters from './Filters';
import Preview from './Preview';
import RequestRedo from './RequestRedo';
import SubmitAnnotations from './SubmitAnnotations';

interface ClassPanelProps {
  onRequestRedoFinish: (imgId: string) => void;
}

const ClassPanel: React.FC<ClassPanelProps> = ({ onRequestRedoFinish }) => {
  return (
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
          <RequestRedo onRequestRedoFinish={onRequestRedoFinish} />

          <Preview />
          <Filters />
          <Annotations />
          <SubmitAnnotations />
        </Container>
      </Drawer>
    </div>
  );
};
export default ClassPanel;

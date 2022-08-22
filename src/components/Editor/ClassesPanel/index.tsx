import React from 'react';
// MUI
import Drawer from '@mui/material/Drawer';
import { Container } from '@mui/material';
import Preview from './Preview';
import Filters from './Filters';
import Annotations from './Annotations';
import SubmitAnnotations from './SubmitAnnotations';
import RequestRedo from './RequestRedo';
import useAuth from 'src/hooks/useAuth';
import { ROLES } from 'src/constants';

interface ClassPanelProps {
  onRequestRedoFinish: (imgId: string) => void;
}

const ClassPanel: React.FC<ClassPanelProps> = ({ onRequestRedoFinish }) => {
  const { role } = useAuth();
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
          {(ROLES.QA.value === role || ROLES.CLIENT.value === role) && (
            <RequestRedo onRequestRedoFinish={onRequestRedoFinish} />
          )}
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

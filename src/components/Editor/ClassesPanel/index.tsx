import { FC, useEffect, memo, useState } from 'react';
// MUI
import { Container } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import Annotations from './Annotations';
import Filters from './Filters';
import Preview from './Preview';
import RequestRedo from './RequestRedo';
import SubmitAnnotations from './SubmitAnnotations';

import useSortedClasses from './hooks/useSortedClasses';

interface Checks {
  [instanceId: string]: boolean;
}
interface ClassPanelProps {
  onRequestRedoFinish: (imgId: string) => void;
}

const ClassPanel: FC<ClassPanelProps> = ({ onRequestRedoFinish }) => {
  const { sortedClasses, sortBy, lastSortType } = useSortedClasses();

  const [checks, setChecks] = useState<Checks>({});

  const updateFiltersChecks = (newChecks: Checks) => setChecks(newChecks);

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
        }}>
        <Container
          sx={{
            width: 300,
            paddingTop: 2,
            paddingBottom: 4,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}>
          <RequestRedo onRequestRedoFinish={onRequestRedoFinish} />

          <Preview />
          <Filters checks={checks} sortBy={sortBy} />
          <Annotations
            classes={sortedClasses}
            lastSortType={lastSortType}
            updateFiltersChecks={updateFiltersChecks}
          />
          <SubmitAnnotations />
        </Container>
      </Drawer>
    </div>
  );
};
export default memo(ClassPanel, () => true);

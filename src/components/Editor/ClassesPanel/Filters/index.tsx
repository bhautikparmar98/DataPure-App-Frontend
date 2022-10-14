import Box from '@mui/material/Box';

import * as React from 'react';
import FilterActions from './FilterActions';

import styles from './filters.module.css';
import useFilters from '../hooks/useFilters';
import Autocomplete from './Autocomplete';
import isEqual from 'lodash/isEqual';

interface Checks {
  [instanceId: string]: boolean;
}

type Props = {
  checks: Checks;
  sortBy: (sortType: 'a-z' | 'newest' | 'oldest') => void;
};

const Filters = ({ checks, sortBy }: Props) => {
  const { classes, selectedClassIndex, classesFilters, handleClassSelect } =
    useFilters();

  return (
    <Box
      className={styles.form}
      sx={{
        marginTop: 2.5,
      }}>
      <Autocomplete
        classes={classes}
        selectedClassIndex={selectedClassIndex}
        handleClassSelect={handleClassSelect}
      />
      <FilterActions
        checks={checks}
        selectedClassIndex={selectedClassIndex}
        classesFilters={classesFilters}
        sortBy={sortBy}
      />
    </Box>
  );
};

const propsAreEqual = (prev: Props, next: Props) => {
  return prev.sortBy === next.sortBy && isEqual(prev.checks, next.checks);
};

export default React.memo(Filters, propsAreEqual);

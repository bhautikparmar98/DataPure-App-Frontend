import styled from '@emotion/styled';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';

import * as React from 'react';
import FilterActions from './FilterActions';

import { TextField } from '@mui/material';
import styles from './filters.module.css';
import useFilters from './hooks/useFilters';

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-input.MuiAutocomplete-input': {
    fontSize: 14,
  },
});

interface Checks {
  [instanceId: string]: boolean;
}

type Props = {
  checks: Checks;
};

const Filters = ({ checks }: Props) => {
  const { classes, selectedClassIndex, classesFilters, handleClassSelect } =
    useFilters();

  return (
    <Box
      className={styles.form}
      sx={{
        marginTop: 2.5,
      }}
    >
      <label htmlFor="editor-classes" className={styles.label}>
        Choose Class ({classes.length})
      </label>

      <Autocomplete
        disablePortal
        id="editor-classes"
        options={classesFilters}
        sx={{ width: 250 }}
        value={{
          label: classes[selectedClassIndex]?.name || 'Choose Class',
          classId: selectedClassIndex,
        }}
        style={{ color: classes[selectedClassIndex]?.color || '#000' }}
        onChange={handleClassSelect}
        fullWidth
        renderInput={(params) => <StyledTextField {...params} />}
        isOptionEqualToValue={(option, value) => option.label === value.label}
      />
      <FilterActions
        checks={checks}
        selectedClassIndex={selectedClassIndex}
        classesFilters={classesFilters}
      />
    </Box>
  );
};

export default React.memo(Filters);

import { Grid } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { selectClass } from 'src/redux/slices/classes/classes.actions';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import styles from './filters.module.css';

// const StyledAutoComplete = styled(Autocomplete)({});

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-input.MuiAutocomplete-input': {
    fontSize: 14,
  },
});

const Filters = () => {
  const { classes, selectedClassId } = useAppSelector(({ classes }) => classes);
  const dispatch = useAppDispatch();

  const classesFilters = classes.map((classItem, i) => ({
    label: classItem.name,
    classId: i,
  }));

  const handleClassSelect = (
    _: any,
    classItem: { label: string; classId: number } | null
  ) => {
    if (classItem) {
      classItem.classId >= 0 ? dispatch(selectClass(classItem.classId)) : null;
    }
  };

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
          label: classes[selectedClassId]?.name || 'Choose Class',
          classId: selectedClassId,
        }}
        style={{ color: classes[selectedClassId]?.color || '#000' }}
        onChange={handleClassSelect}
        fullWidth
        renderInput={(params) => <StyledTextField {...params} />}
        isOptionEqualToValue={(option, value) => option.label === value.label}
      />

      <Box
        component="form"
        noValidate
        sx={{
          display: 'grid',
          gridTemplateColumns: { sm: '1fr 1fr' },
          gap: 2,
          marginTop: 4,
        }}
      >
        <Grid justifyContent={'space-between'}>
          <label htmlFor="editor-action" className={styles.label}>
            Action
          </label>
          <Select
            labelId="editor-action"
            id="editor-action"
            value={0}
            label="input"
            // onChange={handleChange}
            fullWidth
            className={styles.input}
            MenuProps={{
              disableScrollLock: true,
            }}
          >
            <MenuItem value={0}>Input</MenuItem>
            <MenuItem value={1}>Input 2</MenuItem>
            <MenuItem value={2}>Input 3</MenuItem>
          </Select>
        </Grid>
        <div>
          <label htmlFor="editor-sortBy" className={styles.label}>
            Sort By
          </label>
          <Select
            labelId="editor-sortBy"
            id="editor-sortBy"
            value={0}
            fullWidth
            label="input"
            // onChange={handleChange}
            className={styles.input}
            MenuProps={{
              disableScrollLock: true,
            }}
          >
            <MenuItem value={0}>Input</MenuItem>
            <MenuItem value={1}>Input 2</MenuItem>
            <MenuItem value={2}>Input 3</MenuItem>
          </Select>
        </div>
      </Box>
    </Box>
  );
};
export default React.memo(Filters);

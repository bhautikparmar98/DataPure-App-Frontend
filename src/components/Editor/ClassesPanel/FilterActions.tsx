import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { memo } from 'react';
import styles from './filters.module.css';

const FilterActions = memo(() => (
  <Box
    component="form"
    noValidate
    sx={{
      display: 'grid',
      gridTemplateColumns: { sm: '1fr 1fr' },
      gap: 2,
      marginTop: 2,
      paddingBottom: 2,
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
        sx={{ height: 40 }}
      >
        <MenuItem value={0}>Hide</MenuItem>
        <MenuItem value={1}>Delete</MenuItem>
        <MenuItem value={2}>Change Class</MenuItem>
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
        sx={{ height: 40 }}
      >
        <MenuItem value={0}>Class A-Z</MenuItem>
        <MenuItem value={1}>Newest</MenuItem>
        <MenuItem value={2}>Oldest</MenuItem>
      </Select>
    </div>
  </Box>
));

export default FilterActions;

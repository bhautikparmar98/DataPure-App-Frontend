import { Box, Grid } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { memo } from 'React';
import styles from './filters.module.css';

const Actions = memo(() => (
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
));

export default Actions;

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { selectLayer } from 'src/redux/slices/editor/editor.actions';

import styles from './filters.module.css';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { FormGroup, Grid } from '@mui/material';

// const StyledAutoComplete = styled(Autocomplete)({});

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-input.MuiAutocomplete-input': {
    fontSize: 14,
  },
});

const Filters = () => {
  const dispatch = useAppDispatch();
  const { layers, selectedLayerId } = useAppSelector(({ editor }) => editor);

  const layersFilters = layers.map((layer, i) => ({
    label: layer.title,
    layerId: i,
  }));

  const handleLayerSelect = (
    e: any,
    layer: { label: string; layerId: number } | null
  ) => {
    if (layer) {
      layer.layerId >= 0 ? dispatch(selectLayer(layer.layerId)) : null;
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
        Choose Class ({layers.length})
      </label>

      <Autocomplete
        disablePortal
        id="editor-classes"
        options={layersFilters}
        sx={{ width: 250 }}
        value={{
          label: layers[selectedLayerId]?.title || 'Choose Class',
          layerId: selectedLayerId,
        }}
        style={{ color: layers[selectedLayerId]?.color || '#000' }}
        onChange={handleLayerSelect}
        fullWidth
        renderInput={(params) => <StyledTextField {...params} />}
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
export default Filters;

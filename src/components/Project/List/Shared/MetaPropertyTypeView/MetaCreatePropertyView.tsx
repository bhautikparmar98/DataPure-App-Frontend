import {
  Box,
  Button,
  Checkbox,
  ClickAwayListener,
  Dialog,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  TextareaAutosize,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { MetaPropertiesCreateViewProps } from '../types/list.shared';

export interface proertiesProps {
  metaname: string;
  metatype: string;
  displayName: string;
  classes: string;
  maxCharacters: number;
  defaultValue: string;
  descriptions: string;
  required: boolean;
}

const MetaAddNewPropertiesView: React.FC<MetaPropertiesCreateViewProps> = ({
  open,
  error,
  setError,
  setOpen,
  saveProperty,
}) => {
  const initialData = {
    metaname: '',
    metatype: 'text',
    displayName: '',
    classes: '',
    maxCharacters: 0,
    defaultValue: '',
    descriptions: '',
    required: false,
  };
  const [propertiesData, setPropertiesData] =
    useState<proertiesProps>(initialData);

  const onChangeHandler = (field: string, value: string | number | boolean) => {
    let _tempPropertiesData = { ...propertiesData };
    _tempPropertiesData = { ..._tempPropertiesData, [field]: value };
    setPropertiesData(_tempPropertiesData);
  };

  useEffect(() => {
    setPropertiesData(initialData);
  }, [open]);

  return (
    <Dialog open={open} onClose={setOpen} fullWidth={true} maxWidth={'md'}>
      <Box sx={{ p: 6 }}>
        <Typography textTransform={'uppercase'} fontSize={16} fontWeight={600}>
          Add Annotation meta property
        </Typography>
        <Typography fontSize={14} color={'rgb(99, 115, 129)'} fontWeight={500}>
          Configure your requirements using the options provided below
        </Typography>
        <Box>
          <Box display={'flex'} marginBottom="15px" marginTop="15px">
            <TextField
              error={error}
              label="Name"
              required
              fullWidth
              sx={{
                marginRight: '10px',
                '.MuiFormHelperText-root': {
                  color: '#FF4842',
                  ml: '2px',
                  mt: '4px',
                },
              }}
              value={propertiesData.metaname}
              helperText={error && 'Property name is required'}
              name="metaname"
              onChange={(e) => onChangeHandler(e.target.name, e.target.value)}
              onBlur={(e) => setError(e.target.value ? false : true)}
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                id="demo-simple-select-label"
                name="metatype"
                label="Type"
                required
                labelId="demo-simple-select-label"
                value={propertiesData.metatype}
                onChange={(e) =>
                  onChangeHandler(e.target.name, e.target.value)
                }>
                <MenuItem value="text">Text</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Divider />
          <Typography
            textTransform={'uppercase'}
            fontSize={14}
            fontWeight={600}
            marginTop="15px">
            String Properties
          </Typography>
          <Box display={'flex'}>
            <TextField
              margin="normal"
              label="Display Name"
              sx={{
                marginRight: '10px',
              }}
              value={propertiesData.displayName}
              onChange={(e) => onChangeHandler(e.target.name, e.target.value)}
              name="displayName"
              fullWidth
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="demo-simple-select-label">
                Limited to Class(es)
              </InputLabel>
              <Select
                id="demo-simple-select-label"
                label="Limited to Class(es)"
                name="classes"
                fullWidth
                labelId="demo-simple-select-label"
                value={propertiesData.classes}
                onChange={(e) =>
                  onChangeHandler(e.target.name, e.target.value)
                }>
                <MenuItem value="test">test</MenuItem>
                <MenuItem value="test1">test1</MenuItem>
                <MenuItem value="test2">test2</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box display="flex" marginBottom="15px">
            <TextField
              type="number"
              label="Max Characters"
              margin="normal"
              sx={{
                marginRight: '10px',
              }}
              name="maxCharacters"
              value={propertiesData.maxCharacters}
              fullWidth
              onChange={(e) => onChangeHandler(e.target.name, e.target.value)}
              // sx={{ m: 2 }}
            />

            <TextField
              type="string"
              label="Default Value"
              margin="normal"
              fullWidth
              name="defaultValue"
              value={propertiesData.defaultValue}
              onChange={(e) => onChangeHandler(e.target.name, e.target.value)}
              // sx={{ m: 2 }}
              inputProps={{
                maxLength: propertiesData.maxCharacters,
              }}
            />
          </Box>

          <TextField
            placeholder="Provide a short description of the pro perty to aid the annotator(s)."
            multiline
            rows={3}
            variant="outlined"
            fullWidth
            name="descriptions"
            value={propertiesData.descriptions}
            onChange={(e) => onChangeHandler(e.target.name, e.target.value)}
          />
          <Box marginBottom="15px" marginTop="15px">
            <FormControlLabel
              label="Required?"
              control={
                <Checkbox
                  size="small"
                  name="required"
                  value={propertiesData.required}
                  onChange={(e) => {
                    const value = e.target.value === 'true' ? false : true;
                    onChangeHandler(e.target.name, value);
                  }}
                />
              }
              checked={propertiesData.required}
            />
          </Box>
          <Box display={'flex'} justifyContent="end">
            <Button
              variant="outlined"
              sx={{ marginRight: '10px' }}
              onClick={() => {
                if (!propertiesData.metaname)
                  setError(!propertiesData.metaname ? true : false);
                else {
                  saveProperty(propertiesData, '');
                }
              }}>
              Add Property
            </Button>
            <Button variant="outlined" onClick={setOpen}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default MetaAddNewPropertiesView;

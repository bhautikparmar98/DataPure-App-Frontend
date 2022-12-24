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
  IconButton
} from '@mui/material';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/Shared/Iconify';
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
  project,
}) => {
  const initialData = {
    metaname: '',
    metatype: 'text',
    displayName: '',
    classes: '',
    maxCharacters: 30,
    defaultValue: '',
    descriptions: '',
    required: false,
  };
  const [propertiesData, setPropertiesData] = useState<proertiesProps>(initialData);

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
      <Box sx={{ p: 0 }}>
        <Box sx={{backgroundColor: 'rgba(255,255,255,255)',padding:'20px 45px', lineHeight:0}}>
          <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <Typography sx={{color:"rgba(48,63,191,255)", fontWeight:'790', fontSize:'20px'}} textTransform={'uppercase'} fontSize={16} fontWeight={600} >
              Add Annotation meta property
            </Typography>
            <IconButton onClick={setOpen}>
                <Iconify icon={'ic:twotone-close'} width='2rem' height='2rem' color='error' style={{color: 'red'}} />
            </IconButton>
          </Box>
        <Typography fontSize={14} color={'rgb(99, 115, 129)'} fontWeight={500}>
          Configure your requirements using the options provided below
        </Typography>
        </Box>
        <Box sx={{p:6, color:'rgba(242,245,254,255)'}}>
          <Box display={'flex'} marginBottom="15px" marginTop="15px">
            <TextField
              id= "name"
              error={error}
              required
              fullWidth
              sx={{
                marginRight: '10px',
                '.MuiFormHelperText-root': {
                  color: '#FF4842',
                  ml: '2px',
                  mt: '4px',
                },
                backgroundColor: 'white',
              }}
              label='Input'
              placeholder='Input'
              value={propertiesData.metaname}
              helperText={error && 'Property name is required'}
              name="metaname"
              onChange={(e) => onChangeHandler(e.target.name, e.target.value)}
              onBlur={(e) => setError(e.target.value ? false : true)}
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Select</InputLabel>
              <Select
                sx={{backgroundColor:'white', borderColor:'white'}}
                id="demo-simple-select-label"
                name="metatype"
                required
                labelId="demo-simple-select-label"
                label="Select"
                value={propertiesData.metatype}
                onChange={(e) => onChangeHandler(e.target.name, e.target.value)}>
                <MenuItem value="text">Type</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Divider />
          <Typography textTransform={'uppercase'} sx={{color:"rgba(48,63,191,255)"}} fontSize={18} fontWeight={750} marginTop="15px">
            String Properties
          </Typography>
          <Box display={'flex'}>
            <TextField
              margin="normal"
              label="Display Name"
              sx={{
                marginRight: '10px',
                backgroundColor: 'white'
              }}
              value={propertiesData.displayName}
              onChange={(e) => onChangeHandler(e.target.name, e.target.value)}
              name="displayName"
              fullWidth
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="demo-simple-select-label">Limited to Class(es)</InputLabel>
              <Select
                sx={{backgroundColor: 'white'}}
                id="demo-simple-select-label"
                label="Limited to Class(es)"
                name="classes"
                fullWidth
                labelId="demo-simple-select-label"
                value={propertiesData.classes}
                onChange={(e) => onChangeHandler(e.target.name, e.target.value)}>
                {project?.classes?.map((cls, i) => (
                  <MenuItem value={cls.name} key={cls._id}>
                    {cls.name}
                  </MenuItem>
                ))}
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
                backgroundColor: 'white'
              }}
              name="maxCharacters"
              value={propertiesData.maxCharacters}
              fullWidth
              onChange={(e) => onChangeHandler(e.target.name, e.target.value)}
              // sx={{ m: 2 }}
            />

            <TextField
              sx={{backgroundColor: 'white'}}
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
          <Box> 
            <TextField
              placeholder="Provide a short description of the pro perty to aid the annotator(s)."
              multiline
              rows={3}
              variant="outlined"
              fullWidth
              name="descriptions"
              value={propertiesData.descriptions}
              onChange={(e) => onChangeHandler(e.target.name, e.target.value)}
              sx={{backgroundColor: 'white'}}
            />
            <Typography fontSize={14} color={'rgb(99, 115, 129)'}  sx={{textAlign:'right'}} fontWeight={500}>0/300</Typography>
          </Box>
          <Box marginBottom="15px" marginTop="10px">
            <FormControlLabel
              label="Required?"
              control={
                <Checkbox
                  size="small"
                  name="required"
                  value={propertiesData.required}
                  sx={{ color:"rgba(48,63,191,255)" }}
                  onChange={(e) => {
                    const value = e.target.value === 'true' ? false : true;
                    onChangeHandler(e.target.name, value);
                  }}
                />
              }
              checked={propertiesData.required}
            />
          <Typography sx={{display:'inline-block', ml:-10}} fontSize={14} color={'rgb(99, 115, 129)'}  fontWeight={500}>
              Confirm if the "insert what is required" is required.
          </Typography>
          </Box>
          <Box display={'flex'} justifyContent="end">
            <Button variant="outlined"  sx={{color:"rgba(48,63,191,255)", borderColor:"rgba(48,63,191,255)", borderRadius:3, width:100}}  onClick={setOpen}>
              Cancel
            </Button>
            <Button
              variant="outlined"
              sx={{ marginRight: '10px', ml:2, color:'white',borderRadius:3, backgroundColor:'rgba(48,63,191,255)', width:150 }}
              onClick={() => {
                if (!propertiesData.metaname) setError(!propertiesData.metaname ? true : false);
                else {
                  saveProperty(propertiesData, '');
                }
              }}>
              Add Property
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default MetaAddNewPropertiesView;

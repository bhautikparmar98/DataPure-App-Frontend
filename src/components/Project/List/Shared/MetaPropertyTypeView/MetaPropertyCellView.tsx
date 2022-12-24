import {
  Checkbox,
  Dialog,
  DialogTitle,
  Button,
  DialogContent,
  DialogActions,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/Shared/Iconify';
import Label from 'src/components/Shared/Label';
import Scrollbar from 'src/components/Shared/Scrollbar';
import Typography from 'src/theme/overrides/Typography';
import { MetaPropertiesViewProps } from '../types/list.shared';


const propertyHeadingStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  overflow: 'hidden',
  margin: 0
};

const MetaPropertiesList: React.FC<MetaPropertiesViewProps> = ({
  list,
  open,
  setOpen,
  setOpenListView,
}) => {
  const [propertiessList, setPropertiesList] = useState<Array<any>>([]);

  useEffect(() => {
    setPropertiesList(list);
  }, [list]);

  console.log(propertiessList)

  

  return (
    <Dialog open={open} onClose={setOpenListView} maxWidth='md' sx={{backgroundColor:'rgba(244,246,254,255)'}}>
      <DialogContent sx={propertyHeadingStyle}>
        <DialogTitle sx={{color:'rgba(48,63,191,255)', fontWeight: 'bold',  fontSize: '1.35rem', padding:"15px 41px 0px"}}>Property List</DialogTitle>
        <Box
          onClick={setOpen}
          sx={{bgcolor:'transparent', color:'rgba(48,63,191,255)', cursor:'pointer', padding:"21px 71px 0px"}}
        >
          {'+ Add property'}
        </Box>
      </DialogContent>
      <DialogContent sx={{padding:'0px'}}>
        <Box minWidth={800}>
          <Scrollbar>
            <TableContainer sx={{ mt: 0 }}>
              <Table>
                <TableHead >
                  <TableRow >
                    <TableCell align='center'>S.No</TableCell>
                    <TableCell align='center'>MetaName</TableCell>
                    <TableCell align='center'>metaType</TableCell>
                    <TableCell align='center'>classes</TableCell>
                    <TableCell align='center'>Modify</TableCell>
                    <TableCell align='center'>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {propertiessList?.length ? (
                    propertiessList?.map((row: any, index: number) => {
                      return (
                        <TableRow key={row.id}>
                          <TableCell align='center' component='th' scope='row'>
                            {index + 1}
                          </TableCell>
                          <TableCell align='center'>{row.metaname}</TableCell>
                          <TableCell align='center'>
                            <Label color={row.exist ? 'success' : 'error'}>
                              {row.metatype}
                            </Label>
                          </TableCell>
                          <TableCell align='center'>{row.classes}</TableCell>
                          <TableCell align='center'>
                            <IconButton onClick={() => {}} edge='end'>
                              <Iconify icon={'mdi:pencil-outline'} color='error' />
                            </IconButton>
                          </TableCell>
                          <TableCell align='center'>
                            <IconButton onClick={() => {}} edge='end'>
                              <Iconify icon={'mdi:delete'} color='error' style={{color: 'red'}} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                        <span>{'No list found'}</span>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Box>
      </DialogContent>
      <hr style={{color:"rgba(48,63,191,255)"}}></hr>
      <DialogActions>
        <Box flex={1} justifyContent='flex-end' display='flex'>
          <Button sx={{color:"rgba(48,63,191,255)", borderColor:"rgba(48,63,191,255)", borderRadius:3, width:100}} onClick={setOpenListView} color='inherit' variant='outlined'>
            Cancel
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default MetaPropertiesList;

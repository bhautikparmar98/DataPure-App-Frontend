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
import { MetaPropertiesViewProps } from '../types/list.shared';

const propertyHeadingStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  overflow: 'hidden',
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

  return (
    <Dialog open={open} onClose={setOpenListView} maxWidth='md'>
      <DialogContent sx={propertyHeadingStyle}>
        <DialogTitle>Properties List</DialogTitle>
        <Button
          variant={'contained'}
          color={'primary'}
          onClick={setOpen}
          size={'small'}
        >
          {'add property'}
        </Button>
      </DialogContent>
      <DialogContent>
        <Box minWidth={800}>
          <Scrollbar>
            <TableContainer sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>S.No</TableCell>
                    <TableCell align='left'>MetaName</TableCell>
                    <TableCell align='left'>metaType</TableCell>
                    <TableCell align='center'>classes</TableCell>
                    <TableCell align='right'>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {propertiessList?.length ? (
                    propertiessList?.map((row: any, index: number) => {
                      return (
                        <TableRow key={row.id}>
                          <TableCell component='th' scope='row'>
                            {index + 1}
                          </TableCell>
                          <TableCell align='left'>{row.metaname}</TableCell>
                          <TableCell align='left'>
                            <Label color={row.exist ? 'success' : 'error'}>
                              {row.metatype}
                            </Label>
                          </TableCell>
                          <TableCell align='center'>{row.classes}</TableCell>
                          <TableCell align='right'>
                            <IconButton onClick={() => {}} edge='end'>
                              <Iconify icon={'bi:x'} color='error' />
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
      <DialogActions>
        <Box flex={1} justifyContent='flex-end' display='flex'>
          <Button onClick={setOpenListView} color='inherit' variant='outlined'>
            Cancel
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default MetaPropertiesList;

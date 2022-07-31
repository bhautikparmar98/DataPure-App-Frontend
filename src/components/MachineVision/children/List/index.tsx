// @mui
import {
  Card,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Container,
  TableContainer,
  TablePagination,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from 'src/routes/admin/paths';
// hooks
import useSettings from 'src/hooks/useSettings';

import useList from './hooks/useList';
import usePage from 'src/hooks/usePage';
// layouts
import Layout from 'src/layouts';
// components
import Page from 'src/components/Shared/Page';
import Scrollbar from 'src/components/Shared/Scrollbar';
import HeaderBreadcrumbs from 'src/components/Shared/HeaderBreadcrumbs';
// sections
import { ListHead, MoreMenu } from 'src/sections/overview/list';
// types
import { MachineVisionList } from './types';
// constants
import { TABLE_HEAD } from './constants';
// ----------------------------------------------------------------------

List.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function List() {
  const { themeStretch } = useSettings();
  const { handleDelete, mvList } = useList();
  const { page, handleChangeRowsPerPage, setPage, emptyRows, rowsPerPage } = usePage(mvList);

  return (
    <Page title="Machine Vision: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Machine Vision"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Machine Vision', href: PATH_DASHBOARD.machineVision },
            { name: 'List' },
          ]}
        />

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ListHead headLabel={TABLE_HEAD} />
                <TableBody>
                  {mvList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row: MachineVisionList) => {
                      const { id, classifierName, modalUrlGCB1, modalUrlGCB2 } = row;

                      return (
                        <TableRow hover key={id} tabIndex={-1}>
                          <TableCell align="left">{id}</TableCell>
                          <TableCell align="left">{classifierName}</TableCell>
                          <TableCell align="left">{modalUrlGCB1}</TableCell>
                          <TableCell align="left">{modalUrlGCB2}</TableCell>

                          <TableCell align="right">
                            <MoreMenu onDelete={() => handleDelete(id)} item={classifierName} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={mvList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}

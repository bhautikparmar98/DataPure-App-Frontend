import { useState } from 'react';
// next
// @mui
import {
  Card,
  Checkbox,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
// routes
// hooks
import useSettings from 'src/hooks/useSettings';
// @types
// _mock_
// components
import Scrollbar from 'src/components/Shared/Scrollbar';
import SearchNotFound from 'src/components/Shared/SearchNotFound';
// sections
import BackgroundLetterAvatars from 'src/components/Shared/BackgroundLetterAvatars';
import { ROLES } from 'src/constants';
import AddUserDialog from './AddUser';
import UserListTableHeader from './Body/UserListTableHeader';
import UserListTableToolbar from './Body/UserListTableToolbar';
import UserMoreMenu from './Body/UserMoreMenu';
import UserListHeader from './Header';
import useUserListLogic from './useUserListLogic';

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: '' },
];

const UserListComponent = () => {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const [addUserDialog, setAddUserDialog] = useState(false);
  const {
    handleRequestSort,
    handleSelectAllClick,
    handleClick,
    handleChangeRowsPerPage,
    handleFilterByName,
    handleDeleteUser,
    handleDeleteMultiUser,
    emptyRows,
    isNotFound,
    userList,
    page,
    order,
    selected,
    orderBy,
    filterName,
    rowsPerPage,
    filteredUsers,
    setPage,
    usersTotalCount,
    loading,
  } = useUserListLogic();

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <UserListHeader onNewUser={() => setAddUserDialog(true)} />

      <AddUserDialog
        open={addUserDialog}
        onClose={() => setAddUserDialog(false)}
      />

      <Card>
        <UserListTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onDeleteUsers={() => handleDeleteMultiUser(selected)}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <UserListTableHeader
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={userList.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              {loading && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <Paper>
                        <CircularProgress />
                      </Paper>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
              {!loading && (
                <TableBody>
                  {filteredUsers.map((row) => {
                    const { id, firstName, lastName, role, email } = row;

                    const fullName = `${firstName} ${lastName}`;
                    const isItemSelected = selected.indexOf(email) !== -1;

                    return (
                      <TableRow
                        hover
                        key={`user ${id}`}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            onClick={() => handleClick(email)}
                          />
                        </TableCell>

                        <TableCell>#{id}</TableCell>
                        <TableCell
                          sx={{ display: 'flex', alignItems: 'center' }}
                        >
                          <BackgroundLetterAvatars name={fullName} />
                          <Typography variant="subtitle2" noWrap sx={{ ml: 1 }}>
                            {fullName}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{email}</TableCell>
                        <TableCell align="left">{ROLES[role]?.label}</TableCell>

                        <TableCell align="right">
                          <UserMoreMenu
                            onDelete={() => handleDeleteUser(id)}
                            userName={email}
                          />
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
              )}
              {isNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <SearchNotFound searchQuery={filterName} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          rowsPerPageOptions={[1, 5, 10, 25]}
          component="div"
          count={usersTotalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, page) => setPage(page)}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
};

export default UserListComponent;


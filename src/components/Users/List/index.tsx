import { useState } from 'react';
// next
// @mui
import {
  Card,
  Checkbox,
  CircularProgress,
  Container,
  IconButton,
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
import Iconify from 'src/components/Shared/Iconify';
import { useSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'company', label: 'Company', alignRight: false },
  { id: 'password', label: 'Password', alignRight: false },
  { id: '' },
];

const UserListComponent = () => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();
  const [addUserDialog, setAddUserDialog] = useState(false);
  const [showsPasswords, setShowsPasswords] = useState<any>({});

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
    addUserHandler,
  } = useUserListLogic();

  const closeAddUserHandler = (user: any) => {
    setAddUserDialog(false);
    // adding added user to the user list
    if (user) addUserHandler(user);
  };

  const handleShowingPassword = async (id: number) => {
    if (showsPasswords[id]) {
      setShowsPasswords((prev) => ({ ...prev, [id]: undefined }));
      return;
    }

    try {
      const response = await axiosInstance.get(`/user/${id}/password`);
      const { password } = response.data;

      setShowsPasswords((prev: any) => ({
        ...prev,
        [id]: { value: password },
      }));
    } catch (error) {
      console.log('error');
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <UserListHeader onNewUser={() => setAddUserDialog(true)} />

      <AddUserDialog open={addUserDialog} onClose={closeAddUserHandler} />

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
                    const { id, firstName, lastName, role, email, clientInfo } =
                      row;

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
                        <TableCell align="left">
                          {clientInfo?.company}
                        </TableCell>
                        <TableCell align="left">
                          {showsPasswords[id] !== undefined &&
                            showsPasswords[id].value}

                          <IconButton
                            onClick={() => handleShowingPassword(id)}
                            edge="end"
                          >
                            <Iconify
                              icon={
                                showsPasswords[id] !== undefined
                                  ? 'eva:eye-fill'
                                  : 'eva:eye-off-fill'
                              }
                            />
                          </IconButton>
                        </TableCell>

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
          rowsPerPageOptions={[5, 10, 25]}
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

